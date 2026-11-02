from typing import Dict, Any, List
from backend.app.agents.base_agent import BaseAgent
from backend.app.memory.conversation_memory import MemoryManager

class PlannerAgent(BaseAgent):
    """
    Planner Agent acts as the central coordinator and multi-agent orchestrator.
    It decomposes user requests, determines the dynamic Directed Acyclic Graph (DAG)
    execution pipeline, dispatches sub-tasks to specialized agents, and synthesizes
    the final conversational response.
    """
    def __init__(self):
        super().__init__(name="Planner Agent", role="Central Coordinator & Workflow Orchestrator")

    def plan_workflow(self, query: str, session_id: str) -> List[str]:
        """
        Determines which agents need to execute based on semantic intent and conversation state.
        """
        memory = MemoryManager.get_session(session_id)
        q_lower = query.lower()

        # By default, for comprehensive advisory queries, orchestrate all agents
        if any(w in q_lower for w in ["improve", "save", "saving", "advice", "help", "recommend", "how can i"]):
            return ["SpendingAnalysisAgent", "AlertingAgent", "RecommendationAgent"]
        elif any(w in q_lower for w in ["alert", "warning", "overspend", "limit", "budget breach", "risk"]):
            return ["AlertingAgent", "SpendingAnalysisAgent"]
        elif any(w in q_lower for w in ["spend", "expense", "breakdown", "food", "shopping", "trend", "history", "statement"]):
            return ["SpendingAnalysisAgent", "AlertingAgent"]
        else:
            # Fallback to full advisory pipeline
            return ["SpendingAnalysisAgent", "AlertingAgent", "RecommendationAgent"]

    def synthesize_response(self, query: str, state: Dict[str, Any], session_id: str) -> str:
        """
        Combines outputs from the executing specialized agents into a cohesive,
        professional, executive-level banking advisory response.
        """
        memory = MemoryManager.get_session(session_id)
        spending_analysis = state.get("spending_analysis")
        alerts = state.get("alerts", [])
        recommendations = state.get("recommendations", [])

        user_name = state.get("user_profile", {}).get("name", "Valued Customer")

        sections = []
        sections.append(f"Hello {user_name}, here is your personal financial advisory breakdown based on your recent banking activity:\n")

        # 1. Spending Analysis Section
        if spending_analysis:
            totals = spending_analysis.category_breakdown
            sections.append("### 📊 Monthly Spending Analysis (October 2026)")
            sections.append(f"• **Food & Dining**: ₹{totals.get('Food & Dining', 0):,.2f}")
            sections.append(f"• **Shopping**: ₹{totals.get('Shopping', 0):,.2f}")
            sections.append(f"• **Travel & Commute**: ₹{totals.get('Travel & Commute', 0):,.2f}")
            sections.append(f"• **Entertainment**: ₹{totals.get('Entertainment', 0):,.2f}")
            sections.append(f"• **Bills & Utilities**: ₹{totals.get('Bills & Utilities', 0):,.2f}")
            
            # Highlight significant trend
            comp = spending_analysis.previous_month_comparison.get("Food & Dining")
            if comp:
                sections.append(f"\n📈 **Notable Trend:** Food & Dining spending increased by **{comp['percentage_change']}%** compared to previous month (from ₹{comp['previous_month']:,.2f} to ₹{comp['current_month']:,.2f}).")

        # 2. Alerts Section
        if alerts:
            sections.append("\n### 🔔 Proactive Budget & Risk Alerts")
            # Present HIGH overruns followed by top near-limit warnings (including Entertainment)
            high_alerts = [a for a in alerts if a.severity == "HIGH"]
            med_alerts = [a for a in alerts if a.severity == "MEDIUM"]
            low_alerts = [a for a in alerts if a.severity == "LOW"]
            
            selected_alerts = high_alerts[:2] + med_alerts[:2]
            if not selected_alerts and low_alerts:
                selected_alerts = low_alerts[:2]

            for alert in selected_alerts:
                icon = "🚨" if alert.severity == "HIGH" else "⚠️" if alert.severity == "MEDIUM" else "ℹ️"
                sections.append(f"• {icon} **[{alert.severity}] {alert.title}**: {alert.message}")

        # 3. Recommendations Section
        if recommendations:
            sections.append("\n### 💡 Tailored Financial Recommendations")
            for rec in recommendations[:3]:
                sections.append(f"• **{rec.title}**:\n  {rec.recommendation}")
                if rec.actionable_steps:
                    sections.append(f"  *Quick Action:* {rec.actionable_steps[0]}")

        sections.append("\nFeel free to ask for deep dives into specific transactions, custom savings calculators, or adjusting your monthly budget limits.")

        return "\n".join(sections)

    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Recorded during orchestration
        return state
