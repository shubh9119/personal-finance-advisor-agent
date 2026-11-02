from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.app.models.schemas import AgentStepTrace, ToolCallRecord

class BaseAgent(ABC):
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.traces: List[AgentStepTrace] = []

    def record_step(self, action: str, reasoning: str, tool_calls: Optional[List[ToolCallRecord]] = None, output: Optional[str] = None) -> AgentStepTrace:
        trace = AgentStepTrace(
            agent_name=self.name,
            action=action,
            reasoning=reasoning,
            tool_calls=tool_calls or [],
            output=output,
            timestamp=datetime.utcnow().isoformat()
        )
        self.traces.append(trace)
        return trace

    def reset_traces(self):
        self.traces = []

    @abstractmethod
    def run(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the agent logic given the shared state dictionary.
        Returns the updated state.
        """
        pass
