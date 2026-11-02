import os
import sys

# Ensure project root in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from backend.app.models.schemas import (
    ChatRequest,
    AgentOrchestrationResponse,
    Transaction,
    UserProfile,
    AlertItem,
    RecommendationItem,
    SpendingAnalysisResult
)
from backend.app.agents.orchestrator import BankingMultiAgentOrchestrator
from backend.app.data.transaction_store import TransactionRepository
from backend.app.tools.financial_tools import (
    calculate_category_breakdown,
    compute_month_over_month_variance,
    detect_unusual_spending_spikes,
    get_top_spending_merchants
)
from backend.app.memory.conversation_memory import MemoryManager

app = FastAPI(
    title="Retail Banking Agentic AI - Personal Finance Advisor",
    description="Multi-Agent AI Financial Health Advisor for Retail Banking",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = BankingMultiAgentOrchestrator()
repo = TransactionRepository()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Retail Banking Agentic AI Advisor",
        "active_agents": ["PlannerAgent", "SpendingAnalysisAgent", "AlertingAgent", "RecommendationAgent"],
        "orchestration_mode": "Autonomous State Machine (LangGraph Pattern)"
    }

@app.get("/api/user", response_model=UserProfile)
def get_user_profile():
    return repo.get_user_profile()

@app.get("/api/transactions", response_model=List[Transaction])
def get_transactions(month: Optional[str] = "2026-10", category: Optional[str] = None):
    txns = repo.get_all(month=month)
    if category:
        txns = [t for t in txns if t.category.lower() == category.lower()]
    return txns

@app.get("/api/analytics", response_model=SpendingAnalysisResult)
def get_monthly_analytics(month: Optional[str] = "2026-10", comparison_month: Optional[str] = "2026-09"):
    breakdown = calculate_category_breakdown(month=month)
    variance = compute_month_over_month_variance(curr_month=month, prev_month=comparison_month)
    spikes = detect_unusual_spending_spikes(month=month, single_txn_threshold=2000.0)
    top_merchants = get_top_spending_merchants(month=month, top_n=5)

    total_income = breakdown["total_income"]
    total_spend = breakdown["total_spend"]
    savings_rate = round(((total_income - total_spend) / total_income * 100), 2) if total_income > 0 else 0.0

    return SpendingAnalysisResult(
        month=month,
        total_spend=total_spend,
        total_income=total_income,
        savings_rate_pct=savings_rate,
        category_breakdown=breakdown["category_totals"],
        previous_month_comparison=variance["comparison"],
        unusual_spikes=spikes,
        top_merchants=top_merchants
    )

@app.get("/api/alerts", response_model=List[AlertItem])
def get_active_alerts(month: Optional[str] = "2026-10"):
    state = {"target_month": month}
    state = orchestrator.alerting_agent.run(state)
    return state.get("alerts", [])

@app.get("/api/recommendations", response_model=List[RecommendationItem])
def get_recommendations(month: Optional[str] = "2026-10"):
    state = {"target_month": month}
    state = orchestrator.recommendation_agent.run(state)
    return state.get("recommendations", [])

@app.post("/api/chat", response_model=AgentOrchestrationResponse)
def handle_chat_message(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")
    
    response = orchestrator.process_query(
        query=request.message,
        session_id=request.session_id,
        user_id=request.user_id
    )
    return response

@app.post("/api/reset-session")
def reset_session(session_id: str = "default_session"):
    MemoryManager.reset_session(session_id)
    return {"status": "success", "message": f"Session {session_id} memory reset."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
