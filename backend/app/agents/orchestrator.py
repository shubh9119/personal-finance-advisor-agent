from typing import Dict, Any, List
from backend.app.agents.planner_agent import PlannerAgent
from backend.app.agents.spending_agent import SpendingAnalysisAgent
from backend.app.agents.alerting_agent import AlertingAgent
from backend.app.agents.recommendation_agent import RecommendationAgent
from backend.app.memory.conversation_memory import MemoryManager
from backend.app.data.transaction_store import TransactionRepository
from backend.app.models.schemas import AgentOrchestrationResponse, AgentStepTrace

class BankingMultiAgentOrchestrator:
    """
    State-Machine multi-agent orchestrator coordinating:
    PlannerAgent -> [SpendingAnalysisAgent, AlertingAgent, RecommendationAgent] -> Planner Response Synthesis.
    """
    def __init__(self):
        self.repo = TransactionRepository()
        self.planner = PlannerAgent()
        self.spending_agent = SpendingAnalysisAgent()
        self.alerting_agent = AlertingAgent()
        self.recommendation_agent = RecommendationAgent()

    def process_query(self, query: str, session_id: str = "default_session", user_id: str = "USR-7729") -> AgentOrchestrationResponse:
        memory = MemoryManager.get_session(session_id, user_id=user_id)
        memory.add_message(role="user", content=query)

        # Initialize State
        user_profile = self.repo.get_user_profile()
        state: Dict[str, Any] = {
            "query": query,
            "session_id": session_id,
            "target_month": "2026-10",
            "comparison_month": "2026-09",
            "user_profile": user_profile.model_dump(),
            "agent_traces": []
        }

        # Step 1: Planner Agent Formulates Plan
        self.planner.reset_traces()
        execution_plan = self.planner.plan_workflow(query=query, session_id=session_id)
        
        self.planner.record_step(
            action="Formulate Execution Plan",
            reasoning=f"Analyzed query intent '{query}'. Decomposed workflow into required agents: {', '.join(execution_plan)}.",
            output=f"Execution pipeline configured: {' -> '.join(execution_plan)}"
        )
        state["agent_traces"].extend(self.planner.traces)

        # Step 2: Execute Agents Sequentially / Conditionally
        agent_map = {
            "SpendingAnalysisAgent": self.spending_agent,
            "AlertingAgent": self.alerting_agent,
            "RecommendationAgent": self.recommendation_agent
        }

        for agent_name in execution_plan:
            if agent_name in agent_map:
                agent = agent_map[agent_name]
                state = agent.run(state)

        # Step 3: Planner Agent Synthesizes Final Advisory Response
        self.planner.reset_traces()
        final_text = self.planner.synthesize_response(query=query, state=state, session_id=session_id)
        self.planner.record_step(
            action="Synthesize Comprehensive Advisory Response",
            reasoning="Merged analytical findings, alerts, and personalized recommendations into unified customer-facing advisory text.",
            output="Response generated successfully."
        )
        state["agent_traces"].extend(self.planner.traces)

        # Update Memory
        memory.add_message(role="assistant", content=final_text)

        # Build Response Schema
        return AgentOrchestrationResponse(
            query=query,
            session_id=session_id,
            execution_plan=execution_plan,
            agent_traces=state["agent_traces"],
            final_response=final_text,
            spending_summary=state.get("spending_analysis"),
            alerts=state.get("alerts", []),
            recommendations=state.get("recommendations", [])
        )
