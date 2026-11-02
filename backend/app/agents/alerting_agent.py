from typing import Dict, Any, List
from backend.app.agents.base_agent import BaseAgent
from backend.app.models.schemas import AlertItem, ToolCallRecord
from backend.app.tools.financial_tools import evaluate_budget_thresholds, detect_unusual_spending_spikes

class AlertingAgent(BaseAgent):
    """
    Alerting Agent proactively evaluates financial thresholds, detects overspending,
    and generates prioritized warnings (Urgent/Warning/Info).
    """
    def __init__(self):
        super().__init__(name="Alerting Agent", role="Budget Watchdog & Risk Monitor")

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        self.reset_traces()
        current_month = state.get("target_month", "2026-10")

        # Step 1: Tool Call to evaluate budget thresholds
        evaluations = evaluate_budget_thresholds(month=current_month)
        tool_call_1 = ToolCallRecord(
            tool_name="evaluate_budget_thresholds",
            input_args={"month": current_month},
            output_result=evaluations
        )
        self.record_step(
            action="Audit Budget Utilization",
            reasoning=f"Cross-referencing real-time debits for {current_month} against client category budgets.",
            tool_calls=[tool_call_1],
            output=f"Audited {len(evaluations)} budget categories."
        )

        # Step 2: Generate Alert Items based on threshold rules
        alerts: List[AlertItem] = []
        alert_summary_lines: List[str] = []

        # Sort evaluations: Exceeded first by overrun amount, then Near Limit by usage_pct descending
        exceeded_items = sorted(
            [e for e in evaluations if e["status"] == "EXCEEDED"],
            key=lambda x: x["actual_spend"] - x["budget_limit"],
            reverse=True
        )
        near_limit_items = sorted(
            [e for e in evaluations if e["status"] == "NEAR_LIMIT"],
            key=lambda x: x["usage_pct"],
            reverse=True
        )

        # Process Exceeded
        for item in exceeded_items:
            cat = item["category"]
            actual = item["actual_spend"]
            limit = item["budget_limit"]
            usage = item["usage_pct"]
            overrun = round(actual - limit, 2)
            alert = AlertItem(
                id=f"ALT-OV-{cat.replace(' ', '_')}",
                category=cat,
                severity="HIGH",
                title=f"Budget Exceeded in {cat}",
                message=f"You have spent ₹{actual:,.2f}, exceeding your monthly limit of ₹{limit:,.2f} by ₹{overrun:,.2f} ({usage}% utilized).",
                metric=f"{usage}% of budget"
            )
            alerts.append(alert)
            alert_summary_lines.append(f"⚠️ HIGH: {alert.title} - {alert.message}")

        # Process Near Limit (Entertainment with 95% will be first!)
        for item in near_limit_items:
            cat = item["category"]
            actual = item["actual_spend"]
            limit = item["budget_limit"]
            usage = item["usage_pct"]
            alert = AlertItem(
                id=f"ALT-NL-{cat.replace(' ', '_')}",
                category=cat,
                severity="MEDIUM",
                title=f"Nearing Budget Limit for {cat}",
                message=f"You are nearing your monthly {cat.lower()} budget limit. Spent ₹{actual:,.2f} of ₹{limit:,.2f} ({usage}% used, only ₹{item['remaining']:,.2f} remaining).",
                metric=f"{usage}% utilized"
            )
            alerts.append(alert)
            alert_summary_lines.append(f"⚡ WARNING: {alert.title} - {alert.message}")

        # Step 3: Check spikes
        spikes = detect_unusual_spending_spikes(month=current_month, single_txn_threshold=3000.0)
        for spike in spikes:
            alert = AlertItem(
                id=f"ALT-SPK-{spike['transaction_id']}",
                category=spike["category"],
                severity="LOW",
                title=f"High-Value Transaction Notice",
                message=f"Large single expenditure of ₹{spike['amount']:,.2f} at {spike['description']} on {spike['date']}.",
                metric=f"₹{spike['amount']:,.2f}"
            )
            alerts.append(alert)

        self.record_step(
            action="Synthesize Proactive Alerts",
            reasoning=f"Generated {len(alerts)} alerts ({len([a for a in alerts if a.severity == 'HIGH'])} critical).",
            output="\n".join(alert_summary_lines) if alert_summary_lines else "All budgets currently within normal parameters."
        )

        state["alerts"] = alerts
        state["alert_summary"] = alert_summary_lines
        if "agent_traces" not in state:
            state["agent_traces"] = []
        state["agent_traces"].extend(self.traces)

        return state
