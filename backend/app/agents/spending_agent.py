from typing import Dict, Any, List
from backend.app.agents.base_agent import BaseAgent
from backend.app.models.schemas import ToolCallRecord, SpendingAnalysisResult
from backend.app.tools.financial_tools import (
    calculate_category_breakdown,
    compute_month_over_month_variance,
    detect_unusual_spending_spikes,
    get_top_spending_merchants,
    fetch_transactions
)

class SpendingAnalysisAgent(BaseAgent):
    """
    In-Depth Analytical Agent responsible for multi-period transaction parsing,
    categorical aggregation, trend calculation, and statistical anomaly detection.
    """
    def __init__(self):
        super().__init__(name="Spending Analysis Agent", role="Transaction Pattern & Trend Analyzer")

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        self.reset_traces()
        current_month = state.get("target_month", "2026-10")
        previous_month = state.get("comparison_month", "2026-09")

        # Step 1: Ingest & Categorize Current Month Transactions
        reasoning_step1 = (
            f"Initiating financial analysis for billing period '{current_month}'. "
            f"Querying transaction repository to extract debits, credits, and category totals."
        )
        current_breakdown = calculate_category_breakdown(month=current_month)
        tool_call_1 = ToolCallRecord(
            tool_name="calculate_category_breakdown",
            input_args={"month": current_month},
            output_result=current_breakdown
        )
        self.record_step(
            action="Aggregate Monthly Spending",
            reasoning=reasoning_step1,
            tool_calls=[tool_call_1],
            output=f"Aggregated {len(current_breakdown['category_totals'])} categories with total spend ₹{current_breakdown['total_spend']:,.2f}."
        )

        # Step 2: Multi-Period Trend Analysis (MoM Variance)
        reasoning_step2 = (
            f"Comparing '{current_month}' metrics against baseline period '{previous_month}' "
            f"to identify expenditure inflation and anomalous category growth."
        )
        mom_variance = compute_month_over_month_variance(curr_month=current_month, prev_month=previous_month)
        tool_call_2 = ToolCallRecord(
            tool_name="compute_month_over_month_variance",
            input_args={"curr_month": current_month, "prev_month": previous_month},
            output_result=mom_variance
        )
        
        # Identify fastest growing category
        comparisons = mom_variance["comparison"]
        top_growth_cat = max(comparisons.items(), key=lambda x: x[1]["percentage_change"]) if comparisons else None
        growth_summary = (
            f"Key finding: {top_growth_cat[0]} grew by {top_growth_cat[1]['percentage_change']}% "
            f"(₹{top_growth_cat[1]['difference']:+,.2f})" if top_growth_cat else "No variance found."
        )
        self.record_step(
            action="Compute MoM Trends",
            reasoning=reasoning_step2,
            tool_calls=[tool_call_2],
            output=growth_summary
        )

        # Step 3: Anomaly & Single-Transaction Spike Detection
        reasoning_step3 = (
            "Scanning debit transactions for abnormal spikes and high-value single outlays "
            "exceeding standard variance thresholds (> ₹2,000)."
        )
        spikes = detect_unusual_spending_spikes(month=current_month, single_txn_threshold=2000.0)
        tool_call_3 = ToolCallRecord(
            tool_name="detect_unusual_spending_spikes",
            input_args={"month": current_month, "single_txn_threshold": 2000.0},
            output_result=spikes
        )
        self.record_step(
            action="Detect Outliers and Spikes",
            reasoning=reasoning_step3,
            tool_calls=[tool_call_3],
            output=f"Detected {len(spikes)} high-value transactions requiring monitoring."
        )

        # Step 4: Top Merchant Spending Distribution
        top_merchants = get_top_spending_merchants(month=current_month, top_n=5)
        tool_call_4 = ToolCallRecord(
            tool_name="get_top_spending_merchants",
            input_args={"month": current_month, "top_n": 5},
            output_result=top_merchants
        )
        self.record_step(
            action="Analyze Merchant Distribution",
            reasoning="Clustering expenses by merchant entity to detect recurrent high-burn vendors.",
            tool_calls=[tool_call_4],
            output=f"Identified top 5 spend recipients: {', '.join([m['merchant'] for m in top_merchants[:3]])}."
        )

        # Step 5: Construct Structured Analysis Summary
        total_income = current_breakdown["total_income"]
        total_spend = current_breakdown["total_spend"]
        savings = total_income - total_spend
        savings_rate = round((savings / total_income * 100), 2) if total_income > 0 else 0.0

        analysis_result = SpendingAnalysisResult(
            month=current_month,
            total_spend=total_spend,
            total_income=total_income,
            savings_rate_pct=savings_rate,
            category_breakdown=current_breakdown["category_totals"],
            previous_month_comparison=mom_variance["comparison"],
            unusual_spikes=spikes,
            top_merchants=top_merchants
        )

        # Build natural summary text
        cat_totals = current_breakdown["category_totals"]
        summary_lines = [
            f"Monthly Spending Overview ({current_month}):",
            f"• Food & Dining Expenses: ₹{cat_totals.get('Food & Dining', 0):,.2f}",
            f"• Shopping Expenses: ₹{cat_totals.get('Shopping', 0):,.2f}",
            f"• Travel Expenses: ₹{cat_totals.get('Travel & Commute', 0):,.2f}",
            f"• Entertainment Expenses: ₹{cat_totals.get('Entertainment', 0):,.2f}",
            f"• Bills & Utilities: ₹{cat_totals.get('Bills & Utilities', 0):,.2f}",
            f"• Total Outflow: ₹{total_spend:,.2f} | Inflow: ₹{total_income:,.2f} (Savings Rate: {savings_rate}%)"
        ]
        if "Food & Dining" in comparisons:
            fd = comparisons["Food & Dining"]
            summary_lines.append(f"• Food spending increased by {fd['percentage_change']}% compared to previous month (from ₹{fd['previous_month']:,.2f} to ₹{fd['current_month']:,.2f}).")

        spending_text = "\n".join(summary_lines)

        self.record_step(
            action="Synthesize Spending Insights",
            reasoning="Consolidated statistical outputs into standardized banking financial breakdown.",
            output=spending_text
        )

        # Update shared state
        state["spending_analysis"] = analysis_result
        state["spending_text"] = spending_text
        if "agent_traces" not in state:
            state["agent_traces"] = []
        state["agent_traces"].extend(self.traces)

        return state
