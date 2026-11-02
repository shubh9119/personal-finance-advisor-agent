from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class Transaction(BaseModel):
    id: str
    date: str
    description: str
    amount: float
    type: Literal["DEBIT", "CREDIT"]
    category: str
    payment_method: str
    account_id: str = "ACC-IN-982341"

class Budget(BaseModel):
    category: str
    monthly_limit: float
    current_spend: float = 0.0

class UserProfile(BaseModel):
    user_id: str = "USR-7729"
    name: str = "Aarav Sharma"
    account_number: str = "HDFC0001928374"
    currency: str = "₹"
    monthly_income: float = 85000.0
    savings_goal: float = 25000.0
    current_savings: float = 18500.0
    budgets: Dict[str, float] = Field(default_factory=dict)

class ToolCallRecord(BaseModel):
    tool_name: str
    input_args: Dict[str, Any]
    output_result: Any
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class AgentStepTrace(BaseModel):
    agent_name: str
    action: str
    reasoning: str
    tool_calls: List[ToolCallRecord] = Field(default_factory=list)
    output: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default_session"
    user_id: str = "USR-7729"

class AlertItem(BaseModel):
    id: str
    category: str
    severity: Literal["HIGH", "MEDIUM", "LOW", "INFO"]
    title: str
    message: str
    metric: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class RecommendationItem(BaseModel):
    id: str
    category: str
    potential_monthly_savings: float
    impact_level: Literal["HIGH", "MEDIUM", "LOW"]
    title: str
    recommendation: str
    actionable_steps: List[str]

class SpendingAnalysisResult(BaseModel):
    month: str
    total_spend: float
    total_income: float
    savings_rate_pct: float
    category_breakdown: Dict[str, float]
    previous_month_comparison: Dict[str, Dict[str, Any]]
    unusual_spikes: List[Dict[str, Any]]
    top_merchants: List[Dict[str, Any]]

class AgentOrchestrationResponse(BaseModel):
    query: str
    session_id: str
    execution_plan: List[str]
    agent_traces: List[AgentStepTrace]
    final_response: str
    spending_summary: Optional[SpendingAnalysisResult] = None
    alerts: List[AlertItem] = Field(default_factory=list)
    recommendations: List[RecommendationItem] = Field(default_factory=list)
