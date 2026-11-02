#!/usr/bin/env python3
"""
NexusBank AI - Retail Banking Personal Finance Advisor
Interactive Multi-Agent CLI Demonstration
"""
import sys
import os

# Guarantee UTF-8 output on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure backend modules in path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.app.agents.orchestrator import BankingMultiAgentOrchestrator
from backend.app.data.transaction_store import TransactionRepository

def print_banner():
    print("=" * 70)
    print("  🏦 NEXUSBANK AI | RETAIL BANKING PERSONAL FINANCE ADVISOR")
    print("  Autonomous Multi-Agent Orchestration Engine (LangGraph Pattern)")
    print("=" * 70)
    print("  Customer: Aarav Sharma | Account: HDFC0001928374 | Currency: INR (₹)")
    print("  Active Agents: [PlannerAgent, SpendingAnalysisAgent, AlertingAgent, RecommendationAgent]")
    print("-" * 70)

def main():
    print_banner()
    orchestrator = BankingMultiAgentOrchestrator()
    session_id = "cli_session"

    preset_queries = [
        "How can I improve my monthly savings?",
        "Why is my Food & Dining expense so high?",
        "Show my active budget warnings and risk alerts"
    ]

    print("\nQuick Test Queries:")
    for i, q in enumerate(preset_queries, 1):
        print(f"  [{i}] {q}")
    print("  [4] Type your own custom query")
    print("  [q] Exit")

    while True:
        try:
            choice = input("\n👉 Select an option (1-4 or query) [default=1]: ").strip()
            if not choice:
                choice = "1"
            if choice.lower() in ["q", "exit", "quit"]:
                print("\nExiting NexusBank AI Advisor. Have a great day!\n")
                break

            if choice == "1":
                query = preset_queries[0]
            elif choice == "2":
                query = preset_queries[1]
            elif choice == "3":
                query = preset_queries[2]
            elif choice == "4":
                query = input("Enter your financial query: ").strip()
                if not query:
                    continue
            else:
                query = choice

            print(f"\n[USER QUERY]: \"{query}\"")
            print("⏳ Coordinating multi-agent execution pipeline...\n")

            response = orchestrator.process_query(query=query, session_id=session_id)

            print("┌" + "─" * 68 + "┐")
            print(f"│ 🧭 Multi-Agent Execution Plan: {' -> '.join(response.execution_plan):<36} │")
            print("└" + "─" * 68 + "┘")

            print("\n" + response.final_response)

            print("\n" + "─" * 70)
            print("🔍 AGENT REASONING & TOOL TRACE SUMMARY:")
            for trace in response.agent_traces:
                tools_used = [tc.tool_name for tc in trace.tool_calls]
                tool_str = f" [Tools: {', '.join(tools_used)}]" if tools_used else ""
                print(f"  • [{trace.agent_name}] -> {trace.action}{tool_str}")
                print(f"    Reasoning: {trace.reasoning}")
            print("─" * 70)

        except (KeyboardInterrupt, EOFError):
            print("\nExiting NexusBank AI Advisor. Have a great day!\n")
            break
        except Exception as e:
            print(f"\n❌ Error processing query: {e}")

if __name__ == "__main__":
    main()
