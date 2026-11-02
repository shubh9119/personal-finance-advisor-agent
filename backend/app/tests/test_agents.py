import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import pytest
from backend.app.data.transaction_store import TransactionRepository
from backend.app.tools.financial_tools import (
    calculate_category_breakdown,
    compute_month_over_month_variance,
    detect_unusual_spending_spikes,
    evaluate_budget_thresholds,
    calculate_savings_potential
)
from backend.app.agents.spending_agent import SpendingAnalysisAgent
from backend.app.agents.alerting_agent import AlertingAgent
from backend.app.agents.recommendation_agent import RecommendationAgent
from backend.app.agents.planner_agent import PlannerAgent
from backend.app.agents.orchestrator import BankingMultiAgentOrchestrator

def test_transaction_data_integrity():
    repo = TransactionRepository()
    curr_txns = repo.get_current_month_transactions()
    assert len(curr_txns) > 0

    breakdown = calculate_category_breakdown(month="2026-10")
    cat_totals = breakdown["category_totals"]

    # Exact numbers from HackerEarth prompt
    assert cat_totals.get("Food & Dining") == 12000.0
    assert cat_totals.get("Shopping") == 8000.0
    assert cat_totals.get("Travel & Commute") == 3500.0
    print("Transaction data integrity verified successfully.")

def test_month_over_month_variance():
    variance = compute_month_over_month_variance(curr_month="2026-10", prev_month="2026-09")
    food_comparison = variance["comparison"]["Food & Dining"]
    
    # Oct: 12000, Sep: 9600 -> +25%
    assert food_comparison["current_month"] == 12000.0
    assert food_comparison["previous_month"] == 9600.0
    assert food_comparison["percentage_change"] == 25.0
    print("MoM Variance verified: Food & Dining increased by exactly 25.0%.")

def test_budget_threshold_alerts():
    evals = evaluate_budget_thresholds(month="2026-10")
    statuses = {e["category"]: e["status"] for e in evals}
    
    # Food is 12000 vs 10000 limit -> EXCEEDED
    assert statuses["Food & Dining"] == "EXCEEDED"
    # Entertainment is 2850 vs 3000 limit (95%) -> NEAR_LIMIT
    assert statuses["Entertainment"] == "NEAR_LIMIT"
    print("Budget threshold evaluations passed.")

def test_spending_analysis_agent_depth():
    agent = SpendingAnalysisAgent()
    state = {"target_month": "2026-10", "comparison_month": "2026-09"}
    updated = agent.run(state)

    assert "spending_analysis" in updated
    assert len(agent.traces) >= 4  # Deep in-depth reasoning steps
    assert any("calculate_category_breakdown" in t.tool_calls[0].tool_name for t in agent.traces if t.tool_calls)
    print("SpendingAnalysisAgent in-depth execution verified.")

def test_orchestrator_end_to_end():
    orchestrator = BankingMultiAgentOrchestrator()
    response = orchestrator.process_query("How can I improve my monthly savings?")
    
    assert response.execution_plan == ["SpendingAnalysisAgent", "AlertingAgent", "RecommendationAgent"]
    assert len(response.agent_traces) > 0
    assert len(response.alerts) > 0
    assert len(response.recommendations) > 0
    assert "₹12,000" in response.final_response
    assert "₹2,000" in response.final_response
    print("End-to-End Multi-Agent Orchestrator passed!")

if __name__ == "__main__":
    test_transaction_data_integrity()
    test_month_over_month_variance()
    test_budget_threshold_alerts()
    test_spending_analysis_agent_depth()
    test_orchestrator_end_to_end()
    print("ALL TESTS PASSED SUCCESSFULLY!")
