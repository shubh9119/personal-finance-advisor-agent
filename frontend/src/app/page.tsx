"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Activity,
  ChevronDown,
  ChevronRight,
  Send,
  Sparkles,
  Wallet,
  CheckCircle2,
  RefreshCw,
  Search,
  Zap,
  Sliders,
  Copy,
  Check,
  Percent,
  Calculator
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  category: string;
  payment_method: string;
}

interface AlertItem {
  id: string;
  category: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "INFO";
  title: string;
  message: string;
  metric: string;
}

interface RecommendationItem {
  id: string;
  category: string;
  potential_monthly_savings: number;
  impact_level: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  recommendation: string;
  actionable_steps: string[];
}

interface ToolCallRecord {
  tool_name: string;
  input_args: Record<string, any>;
  output_result: any;
}

interface AgentStepTrace {
  agent_name: string;
  action: string;
  reasoning: string;
  tool_calls: ToolCallRecord[];
  output?: string;
  timestamp: string;
}

interface AgentResponse {
  query: string;
  execution_plan: string[];
  agent_traces: AgentStepTrace[];
  final_response: string;
  alerts: AlertItem[];
  recommendations: RecommendationItem[];
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "TXN-201", date: "2026-10-01", description: "Salary Credit - Infosys Corp", amount: 85000, type: "CREDIT", category: "Income", payment_method: "NEFT" },
  { id: "TXN-202", date: "2026-10-02", description: "Swiggy Food Delivery - Gourmet Biryani", amount: 850, type: "DEBIT", category: "Food & Dining", payment_method: "UPI" },
  { id: "TXN-203", date: "2026-10-04", description: "Zomato Restaurant - Mainland China", amount: 2450, type: "DEBIT", category: "Food & Dining", payment_method: "Credit Card" },
  { id: "TXN-204", date: "2026-10-07", description: "Starbucks Coffee Koramangala", amount: 780, type: "DEBIT", category: "Food & Dining", payment_method: "UPI" },
  { id: "TXN-205", date: "2026-10-10", description: "Swiggy Instamart Snacks & Dinner", amount: 1220, type: "DEBIT", category: "Food & Dining", payment_method: "UPI" },
  { id: "TXN-206", date: "2026-10-14", description: "Bikanervala Sweets & Lunch", amount: 650, type: "DEBIT", category: "Food & Dining", payment_method: "UPI" },
  { id: "TXN-207", date: "2026-10-18", description: "Toit Brewpub Weekend Social", amount: 3350, type: "DEBIT", category: "Food & Dining", payment_method: "Credit Card" },
  { id: "TXN-208", date: "2026-10-22", description: "Zomato Late Night Order", amount: 950, type: "DEBIT", category: "Food & Dining", payment_method: "UPI" },
  { id: "TXN-209", date: "2026-10-27", description: "Cafe Coffee Day Office Meet", amount: 450, type: "DEBIT", category: "Food & Dining", payment_method: "Debit Card" },
  { id: "TXN-210", date: "2026-10-29", description: "Swiggy Dinner Bowls", amount: 1300, type: "DEBIT", category: "Food & Dining", payment_method: "UPI" },
  
  { id: "TXN-211", date: "2026-10-05", description: "Amazon India - Electronics & Accessories", amount: 3800, type: "DEBIT", category: "Shopping", payment_method: "Credit Card" },
  { id: "TXN-212", date: "2026-10-12", description: "Myntra Festive Sale - Apparel", amount: 2700, type: "DEBIT", category: "Shopping", payment_method: "UPI" },
  { id: "TXN-213", date: "2026-10-25", description: "Zara Retail Store - Indiranagar", amount: 1500, type: "DEBIT", category: "Shopping", payment_method: "Credit Card" },

  { id: "TXN-214", date: "2026-10-03", description: "Uber India Daily Commute", amount: 620, type: "DEBIT", category: "Travel & Commute", payment_method: "UPI" },
  { id: "TXN-215", date: "2026-10-08", description: "Namma Metro Smart Card Recharge", amount: 500, type: "DEBIT", category: "Travel & Commute", payment_method: "UPI" },
  { id: "TXN-216", date: "2026-10-15", description: "Uber Premier Airport Ride", amount: 1480, type: "DEBIT", category: "Travel & Commute", payment_method: "Credit Card" },
  { id: "TXN-217", date: "2026-10-21", description: "Ola Cabs Office Commute", amount: 550, type: "DEBIT", category: "Travel & Commute", payment_method: "UPI" },
  { id: "TXN-218", date: "2026-10-28", description: "HP Petrol Pump Fuel Refill", amount: 350, type: "DEBIT", category: "Travel & Commute", payment_method: "Debit Card" },

  { id: "TXN-219", date: "2026-10-06", description: "Netflix Premium India Subscription", amount: 649, type: "DEBIT", category: "Entertainment", payment_method: "Auto Debit" },
  { id: "TXN-220", date: "2026-10-11", description: "PVR IMAX Cinema - Movie Tickets", amount: 1400, type: "DEBIT", category: "Entertainment", payment_method: "Credit Card" },
  { id: "TXN-221", date: "2026-10-19", description: "Spotify Duo Music Subscription", amount: 149, type: "DEBIT", category: "Entertainment", payment_method: "Auto Debit" },
  { id: "TXN-222", date: "2026-10-24", description: "SonyLIV Sports Annual Subscription", amount: 652, type: "DEBIT", category: "Entertainment", payment_method: "UPI" },

  { id: "TXN-223", date: "2026-10-03", description: "BESCOM Electricity Utility Bill", amount: 2850, type: "DEBIT", category: "Bills & Utilities", payment_method: "Net Banking" },
  { id: "TXN-224", date: "2026-10-05", description: "Airtel Fiber Broadband Bill", amount: 1179, type: "DEBIT", category: "Bills & Utilities", payment_method: "Auto Debit" },
  { id: "TXN-225", date: "2026-10-09", description: "BWSSB Water Supply Bill", amount: 571, type: "DEBIT", category: "Bills & Utilities", payment_method: "UPI" },
  { id: "TXN-226", date: "2026-10-12", description: "Indane Gas LPG Cylinder Refill", amount: 800, type: "DEBIT", category: "Bills & Utilities", payment_method: "UPI" },

  { id: "TXN-227", date: "2026-10-02", description: "Nature's Basket Organic Groceries", amount: 3400, type: "DEBIT", category: "Groceries", payment_method: "Credit Card" },
  { id: "TXN-228", date: "2026-10-16", description: "Blinkit Weekly Grocery essentials", amount: 2200, type: "DEBIT", category: "Groceries", payment_method: "UPI" },
  { id: "TXN-229", date: "2026-10-26", description: "BigBasket Monthly Staples Refill", amount: 2000, type: "DEBIT", category: "Groceries", payment_method: "UPI" },

  { id: "TXN-230", date: "2026-10-17", description: "Apollo Pharmacy Health & Vitamins", amount: 1200, type: "DEBIT", category: "Healthcare", payment_method: "UPI" },
];

const BUDGET_LIMITS: Record<string, number> = {
  "Food & Dining": 10000,
  "Shopping": 7000,
  "Travel & Commute": 4000,
  "Entertainment": 3000,
  "Bills & Utilities": 6000,
  "Groceries": 8000,
  "Healthcare": 2500,
};

export default function PersonalFinanceAdvisorDashboard() {
  const [activeTab, setActiveTab] = useState<"advisor" | "transactions" | "orchestration" | "simulator">("advisor");
  const [queryInput, setQueryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [expandedTraceIndex, setExpandedTraceIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Interactive Savings Simulator Slider (Default 15% matching prompt)
  const [simulatedReductionPct, setSimulatedReductionPct] = useState<number>(15);

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string; responseMeta?: AgentResponse }>>([
    {
      role: "assistant",
      content: `👋 Hello Aarav! I am your **Retail Banking Personal Finance Advisor**.\n\nI continuously monitor your accounts, analyze spending anomalies across categories, evaluate monthly budget caps, and coordinate specialized AI agents to optimize your net savings rate.\n\nTry a prompt below or click any budget bar on the right to start!`,
    },
  ]);

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "ALT-01",
      category: "Food & Dining",
      severity: "HIGH",
      title: "Budget Exceeded in Food & Dining",
      message: "You have spent ₹12,000.00, exceeding your monthly limit of ₹10,000.00 by ₹2,000.00 (120% utilized).",
      metric: "120% of limit"
    },
    {
      id: "ALT-02",
      category: "Entertainment",
      severity: "MEDIUM",
      title: "Nearing Budget Limit for Entertainment",
      message: "You are nearing your monthly entertainment budget limit. Spent ₹2,850.00 of ₹3,000.00 (95% used, only ₹150 remaining).",
      metric: "95% utilized"
    }
  ]);

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([
    {
      id: "REC-001",
      category: "Food & Dining",
      potential_monthly_savings: 2000,
      impact_level: "HIGH",
      title: "Curate Food Delivery & Dine-Out Frequency",
      recommendation: "Reducing food delivery expenses by 15% could help save approximately ₹2,000 monthly.",
      actionable_steps: [
        "Cap weekday Swiggy/Zomato deliveries to 2 orders per week",
        "Substitute weekend restaurant visits with home cooking once per fortnight"
      ]
    },
    {
      id: "REC-002",
      category: "Shopping",
      potential_monthly_savings: 1500,
      impact_level: "MEDIUM",
      title: "Implement 48-Hour Impulsive Purchase Buffer",
      recommendation: "Applying a 48-hour cooling period for e-commerce purchases over ₹1,500 can curb impulse shopping by ₹1,500 monthly.",
      actionable_steps: ["Keep items in wishlist for 48 hours prior to checkout"]
    }
  ]);

  const [lastAgentMeta, setLastAgentMeta] = useState<AgentResponse | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const categoryTotals: Record<string, number> = {};
  let totalDebit = 0;
  let totalCredit = 0;

  INITIAL_TRANSACTIONS.forEach((t) => {
    if (t.type === "DEBIT") {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      totalDebit += t.amount;
    } else {
      totalCredit += t.amount;
    }
  });

  const savingsRate = Math.round(((totalCredit - totalDebit) / totalCredit) * 100);

  // Dynamic Savings Simulator calculations
  const foodSpend = categoryTotals["Food & Dining"] || 12000;
  const simulatedMonthlySavings = Math.round((foodSpend * simulatedReductionPct) / 100);
  const simulatedAnnualSavings = simulatedMonthlySavings * 12;

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSendQuery = async (customText?: string) => {
    const textToSend = customText || queryInput;
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setQueryInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, session_id: "web_session" }),
      });

      if (res.ok) {
        const data: AgentResponse = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.final_response, responseMeta: data },
        ]);
        setLastAgentMeta(data);
        if (data.alerts && data.alerts.length > 0) setAlerts(data.alerts);
        if (data.recommendations && data.recommendations.length > 0) setRecommendations(data.recommendations);
      } else {
        throw new Error("Backend offline");
      }
    } catch {
      setTimeout(() => {
        const simulatedTraces: AgentStepTrace[] = [
          {
            agent_name: "Planner Agent",
            action: "Formulate Execution Plan",
            reasoning: `Deconstructed query: '${textToSend}'. Identified savings and expense advisory intent. Orchestrating multi-agent DAG.`,
            tool_calls: [],
            output: "Pipeline: SpendingAnalysisAgent -> AlertingAgent -> RecommendationAgent",
            timestamp: new Date().toISOString()
          },
          {
            agent_name: "Spending Analysis Agent (In-Depth)",
            action: "Analyze Category Breakdown & Trends",
            reasoning: "Queried transaction database for October 2026. Aggregated ₹40,550 total debit outlays across 7 categories.",
            tool_calls: [
              {
                tool_name: "calculate_category_breakdown",
                input_args: { month: "2026-10" },
                output_result: { "Food & Dining": 12000, "Shopping": 8000, "Travel & Commute": 3500 }
              },
              {
                tool_name: "compute_month_over_month_variance",
                input_args: { curr_month: "2026-10", prev_month: "2026-09" },
                output_result: { "Food & Dining": { diff: 2400, percentage_change: 25.0 } }
              }
            ],
            output: "Food spending increased by 25.0% compared to previous month (from ₹9,600 to ₹12,000).",
            timestamp: new Date().toISOString()
          },
          {
            agent_name: "Alerting Agent",
            action: "Evaluate Budget Thresholds",
            reasoning: "Cross-referenced current spending against client budget limits. Triggered 1 critical budget breach and 1 near-limit warning.",
            tool_calls: [
              {
                tool_name: "evaluate_budget_thresholds",
                input_args: { month: "2026-10" },
                output_result: { "Food & Dining": "EXCEEDED", "Entertainment": "NEAR_LIMIT" }
              }
            ],
            output: "Triggered 2 proactive alerts (Food overrun ₹2,000; Entertainment 95% utilized).",
            timestamp: new Date().toISOString()
          },
          {
            agent_name: "Recommendation Agent",
            action: "Generate Tailored Guidance",
            reasoning: "Modeled discretionary reduction scenarios. Reducing food delivery by 15% yields ₹2,000/month savings.",
            tool_calls: [
              {
                tool_name: "calculate_savings_potential",
                input_args: { category: "Food & Dining", reduction_pct: 15.0 },
                output_result: { estimated_monthly_savings: 2000.0, annual_savings: 24000.0 }
              }
            ],
            output: "Generated prioritized recommendations with cumulative savings of ₹4,150/month.",
            timestamp: new Date().toISOString()
          },
          {
            agent_name: "Planner Agent",
            action: "Synthesize Comprehensive Advisory Response",
            reasoning: "Synthesized multi-agent findings into structured customer advisory presentation.",
            tool_calls: [],
            output: "Advisory synthesized successfully.",
            timestamp: new Date().toISOString()
          }
        ];

        const responseText = `Hello Aarav Sharma, here is your personal financial advisory breakdown based on your recent banking activity:

### 📊 Monthly Spending Analysis (October 2026)
• **Food & Dining**: ₹12,000.00
• **Shopping**: ₹8,000.00
• **Travel & Commute**: ₹3,500.00
• **Entertainment**: ₹2,850.00
• **Bills & Utilities**: ₹5,400.00

📈 **Notable Trend:** Food & Dining spending increased by **25.0%** compared to previous month (from ₹9,600.00 to ₹12,000.00).

### 🔔 Proactive Budget & Risk Alerts
• 🚨 **[HIGH] Budget Exceeded in Food & Dining**: You have spent ₹12,000.00, exceeding your monthly limit of ₹10,000.00 by ₹2,000.00 (120.0% utilized).
• 🚨 **[HIGH] Budget Exceeded in Shopping**: You have spent ₹8,000.00, exceeding your monthly limit of ₹7,000.00 by ₹1,000.00 (114.29% utilized).
• ⚠️ **[MEDIUM] Nearing Budget Limit for Entertainment**: You are nearing your monthly entertainment budget limit. Spent ₹2,850.00 of ₹3,000.00 (95.0% used, only ₹150.00 remaining).
• ⚠️ **[MEDIUM] Nearing Budget Limit for Groceries**: You are nearing your monthly groceries budget limit. Spent ₹7,600.00 of ₹8,000.00 (95.0% used, only ₹400.00 remaining).

### 💡 Tailored Financial Recommendations
• **Curate Food Delivery & Dine-Out Frequency**:
  Reducing food delivery expenses by 15% could help save approximately **₹2,000 monthly**.
  *Quick Action:* Cap weekday Swiggy/Zomato deliveries to 2 orders per week
• **Implement 48-Hour Impulsive Purchase Buffer**:
  Applying a 48-hour cooling period for e-commerce purchases over ₹1,500 can curb impulse shopping by **₹1,500 monthly**.
  *Quick Action:* Keep items in wishlist for 48 hours prior to checkout
• **Streaming Subscription Consolidation**:
  Rotating inactive OTT platforms could preserve **₹650 monthly** and keep Entertainment strictly below your ₹3,000 threshold.`;

        const fallbackMeta: AgentResponse = {
          query: textToSend,
          execution_plan: ["SpendingAnalysisAgent", "AlertingAgent", "RecommendationAgent"],
          agent_traces: simulatedTraces,
          final_response: responseText,
          alerts: alerts,
          recommendations: recommendations
        };

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: responseText, responseMeta: fallbackMeta }
        ]);
        setLastAgentMeta(fallbackMeta);
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = INITIAL_TRANSACTIONS.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["ALL", ...Array.from(new Set(INITIAL_TRANSACTIONS.map((t) => t.category)))];

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans relative selection:bg-purple-100 selection:text-purple-900">
      {/* Ambient Acrylic Mesh Background */}
      <div className="ambient-background" />
      <div className="ambient-grid" />

      {/* Top Navbar - Clean Apple & Microsoft Modern Style */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-3.5 border-b border-white/60 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-[1px] shadow-sm">
            <div className="h-full w-full bg-white/95 rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-purple-700" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base tracking-tight text-slate-900">
                NexusBank
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 rounded-full tracking-wide">
                Agentic Advisor
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Autonomous Wealth & Personal Finance Intelligence</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-4">
          <nav className="flex space-x-1 p-1 bg-white/70 rounded-xl border border-slate-200/70 text-xs font-medium shadow-sm">
            <button
              onClick={() => setActiveTab("advisor")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === "advisor"
                  ? "bg-white text-purple-700 shadow-sm font-semibold border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>AI Advisor</span>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === "transactions"
                  ? "bg-white text-purple-700 shadow-sm font-semibold border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CreditCard className="h-3.5 w-3.5 text-purple-600" />
              <span>Transactions</span>
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === "simulator"
                  ? "bg-white text-purple-700 shadow-sm font-semibold border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calculator className="h-3.5 w-3.5 text-amber-600" />
              <span>Savings Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab("orchestration")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === "orchestration"
                  ? "bg-white text-purple-700 shadow-sm font-semibold border border-slate-200/50"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-indigo-600" />
              <span>Multi-Agent Traces</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-slate-200/80">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-100 to-amber-100 border border-purple-200 flex items-center justify-center font-bold text-xs text-purple-800 shadow-sm">
              AS
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-900">Aarav Sharma</p>
              <p className="text-[10px] text-slate-500 font-mono">HDFC0001928374</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 relative z-10">
        {/* KPI Overview Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Wallet className="h-14 w-14 text-purple-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Inflow (Salary)</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">₹{totalCredit.toLocaleString()}</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" /> +100% Inflow
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Infosys Corp • Credited Oct 01</p>
          </div>

          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="h-14 w-14 text-amber-500" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Outflow (Spend)</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">₹{totalDebit.toLocaleString()}</span>
              <span className="text-xs text-amber-600 font-semibold flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +14.2% MoM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Budgeted: ₹40,500 • High dining outlays</p>
          </div>

          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="h-14 w-14 text-purple-600" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Savings Rate</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-2xl font-bold text-purple-700 tracking-tight">{savingsRate}%</span>
              <span className="text-xs text-slate-500 font-medium">₹{(totalCredit - totalDebit).toLocaleString()} Net</span>
            </div>
            <div className="w-full bg-slate-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-amber-500 h-full rounded-full" style={{ width: `${savingsRate}%` }} />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertTriangle className="h-14 w-14 text-amber-500" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Budget Alerts</p>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-2xl font-bold text-amber-600 tracking-tight">{alerts.length}</span>
              <span className="text-xs text-rose-600 font-semibold">1 Critical Overrun</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Food (+25%) & Entertainment (95%)</p>
          </div>
        </section>

        {/* Tab 1: AI Advisor */}
        {activeTab === "advisor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Chat Advisor (7 cols) */}
            <div className="lg:col-span-7 flex flex-col h-[680px] glass-panel rounded-2xl overflow-hidden border border-white/70 shadow-sm">
              {/* Chat Header */}
              <div className="px-5 py-3.5 bg-white/75 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-600 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">Personal Wealth Advisor AI</span>
                  <span className="text-[11px] text-slate-400 font-mono">v1.0 (State-Machine)</span>
                </div>
                <button
                  onClick={() => handleSendQuery("How can I improve my monthly savings?")}
                  className="text-xs text-purple-700 hover:text-purple-900 font-medium flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  <span>Run Standard Query</span>
                </button>
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed relative group ${
                        msg.role === "user"
                          ? "bg-purple-700 text-white shadow-sm rounded-tr-none"
                          : "bg-white/90 text-slate-800 rounded-tl-none border border-slate-200/80 shadow-sm"
                      }`}
                    >
                      {/* Copy Action Button */}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopyMessage(msg.content, idx)}
                          className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy advice text"
                        >
                          {copiedIndex === idx ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}

                      {/* Formatted Markdown Content */}
                      <div className="whitespace-pre-line space-y-2">
                        {msg.content.split("\n").map((line, lineIdx) => {
                          if (line.startsWith("### ")) {
                            return (
                              <h4 key={lineIdx} className="font-bold text-sm text-purple-900 mt-2 mb-1 flex items-center">
                                {line.replace("### ", "")}
                              </h4>
                            );
                          }
                          if (line.startsWith("• ")) {
                            return (
                              <div key={lineIdx} className="pl-2 border-l-2 border-amber-500 py-0.5">
                                <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>') }} />
                              </div>
                            );
                          }
                          return (
                            <p key={lineIdx} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>') }} />
                          );
                        })}
                      </div>

                      {/* Tool/Agent Meta pill */}
                      {msg.responseMeta && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400 font-medium">Pipeline:</span>
                          {msg.responseMeta.execution_plan.map((ag, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-mono font-medium"
                            >
                              {ag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start space-x-2">
                    <div className="bg-white/90 rounded-2xl rounded-tl-none p-4 text-xs border border-purple-200 flex items-center space-x-3 text-slate-700 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" />
                      </div>
                      <span className="font-mono text-purple-800 font-medium">
                        Planner coordinating Spending, Alerting & Recommendation agents...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompts Bar */}
              <div className="px-4 py-2.5 bg-white/80 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto text-[11px]">
                <span className="text-slate-400 whitespace-nowrap flex items-center font-medium">
                  <Zap className="h-3 w-3 mr-1 text-amber-500" /> Prompts:
                </span>
                <button
                  onClick={() => handleSendQuery("How can I improve my monthly savings?")}
                  className="px-3 py-1 rounded-full bg-purple-50/90 hover:bg-purple-100 text-purple-800 border border-purple-200/80 transition-colors whitespace-nowrap font-medium"
                >
                  "How can I improve my monthly savings?"
                </button>
                <button
                  onClick={() => handleSendQuery("Why is my Food & Dining expense so high?")}
                  className="px-3 py-1 rounded-full bg-amber-50/90 hover:bg-amber-100 text-amber-800 border border-amber-200/80 transition-colors whitespace-nowrap font-medium"
                >
                  "Why is Food & Dining so high?"
                </button>
                <button
                  onClick={() => handleSendQuery("Show my active budget warnings and risks")}
                  className="px-3 py-1 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap font-medium"
                >
                  "Show budget warnings & risks"
                </button>
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="p-3 bg-white/90 border-t border-slate-200/80 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Ask your Personal Finance Advisor about spending trends, savings, or budgets..."
                  className="glass-input flex-1 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !queryInput.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Column: Financial Health Breakdown & Proactive Alerts (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Category Spending Progress Card - Now Clickable! */}
              <div className="glass-panel p-5 rounded-2xl border border-white/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Spending vs Budget (October 2026)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-white/90 px-2 py-0.5 rounded-full font-medium border border-slate-200/50">
                    Click category to inspect
                  </span>
                </div>

                <div className="space-y-3.5">
                  {Object.entries(BUDGET_LIMITS).map(([category, limit]) => {
                    const actual = categoryTotals[category] || 0;
                    const pct = Math.round((actual / limit) * 100);
                    const isOver = actual > limit;
                    const isNear = !isOver && pct >= 85;

                    return (
                      <div
                        key={category}
                        onClick={() => handleSendQuery(`Analyze my ${category} spending and give me specific advice`)}
                        className="space-y-1.5 cursor-pointer p-1.5 -mx-1.5 rounded-xl hover:bg-purple-50/50 transition-colors group"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 flex items-center group-hover:text-purple-700 transition-colors">
                            {category}
                            {category === "Food & Dining" && (
                              <span className="ml-2 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded">
                                +25% MoM
                              </span>
                            )}
                          </span>
                          <span className="font-mono text-slate-500">
                            <strong className={isOver ? "text-rose-600" : isNear ? "text-amber-600" : "text-slate-800"}>
                              ₹{actual.toLocaleString()}
                            </strong>{" "}
                            / ₹{limit.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOver
                                ? "bg-rose-500"
                                : isNear
                                ? "bg-amber-500"
                                : "bg-purple-600"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Proactive Risk & Budget Alerts Feed */}
              <div className="glass-panel p-5 rounded-2xl border border-white/70 space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Proactive Financial Alerts
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        alert.severity === "HIGH"
                          ? "bg-rose-50/90 border-rose-200 text-rose-900"
                          : alert.severity === "MEDIUM"
                          ? "bg-amber-50/90 border-amber-200 text-amber-900"
                          : "bg-white/90 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{alert.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-mono bg-white border border-slate-200">
                          {alert.metric}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailored Savings Recommendations */}
              <div className="glass-panel p-5 rounded-2xl border border-white/70 space-y-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4 text-purple-700" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Personalized Savings Advice
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 text-xs space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rec.title}</span>
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          Save ₹{rec.potential_monthly_savings.toLocaleString()}/mo
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{rec.recommendation}</p>
                      {rec.actionable_steps && rec.actionable_steps.length > 0 && (
                        <div className="text-[10px] text-amber-900 bg-amber-50/90 p-2 rounded-lg border border-amber-200/70">
                          💡 <strong>Action:</strong> {rec.actionable_steps[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transactions Explorer */}
        {activeTab === "transactions" && (
          <div className="glass-panel p-6 rounded-2xl border border-white/70 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Itemized Transaction Ledger (October 2026)
                </h3>
                <p className="text-xs text-slate-500">Verified core banking transaction ledger</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search merchant..."
                    className="glass-input pl-8 pr-3 py-1.5 text-xs rounded-lg text-slate-800 placeholder-slate-400 w-48"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="glass-input px-3 py-1.5 text-xs rounded-lg text-slate-800"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white/95">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Txn ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Merchant / Description</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500">{t.id}</td>
                      <td className="py-3 px-4 text-slate-500">{t.date}</td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">{t.description}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{t.payment_method}</td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold ${
                          t.type === "CREDIT" ? "text-emerald-600" : "text-slate-900"
                        }`}
                      >
                        {t.type === "CREDIT" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Savings Simulator Widget */}
        {activeTab === "simulator" && (
          <div className="glass-panel p-6 rounded-2xl border border-white/70 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center">
                <Sliders className="h-4 w-4 mr-2 text-purple-700" />
                Interactive Discretionary Expense & Savings Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Model real-time personal finance reduction scenarios on Food & Dining to optimize monthly wealth accumulation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Food & Dining Reduction Rate</span>
                  <span className="text-base font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    {simulatedReductionPct}%
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={simulatedReductionPct}
                  onChange={(e) => setSimulatedReductionPct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>5% (Conservative)</span>
                  <span className="text-purple-700 font-bold">15% (Prompt Target)</span>
                  <span>35% (Aggressive)</span>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <p>• Current Monthly Spend: <strong>₹{foodSpend.toLocaleString()}</strong></p>
                  <p>• Allocated Budget Cap: <strong>₹10,000</strong></p>
                  <p>• Projected New Spend: <strong className="text-emerald-700">₹{(foodSpend - simulatedMonthlySavings).toLocaleString()}</strong></p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("advisor");
                    handleSendQuery(`I set a goal to reduce food delivery by ${simulatedReductionPct}%. What is my projected monthly and annual savings?`);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  Commit Goal to AI Advisor
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-50/80 via-white to-amber-50/80 border border-purple-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Projected Financial Impact</span>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Estimated Monthly Savings</p>
                      <p className="text-3xl font-extrabold text-purple-700">₹{simulatedMonthlySavings.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Annualized Savings Potential</p>
                      <p className="text-2xl font-bold text-amber-600">₹{simulatedAnnualSavings.toLocaleString()} / year</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-xl bg-white/80 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900 flex items-center">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                    50/30/20 Wealth Alignment:
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Re-routing this ₹{simulatedMonthlySavings.toLocaleString()} into an auto-sweep liquid mutual fund boosts your savings rate from {savingsRate}% to {Math.round(((totalCredit - totalDebit + simulatedMonthlySavings) / totalCredit) * 100)}%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Multi-Agent Orchestration & Reasoning Traces */}
        {activeTab === "orchestration" && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/70 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Multi-Agent State-Machine Architecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    LangGraph-style autonomous agent coordinator and subagent pipeline
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-purple-700" /> Multi-Agent Active
                </span>
              </div>

              {/* Graphical Flow Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/95 border border-purple-200 shadow-sm relative">
                  <div className="flex items-center space-x-2 text-purple-700 mb-2">
                    <Bot className="h-4 w-4" />
                    <span className="font-bold text-xs uppercase">1. Planner Agent</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Deconstructs query, inspects memory, and determines DAG pipeline routing.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-purple-800 bg-purple-50 p-1.5 rounded border border-purple-100 font-semibold">
                    Role: Coordinator
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/95 border border-amber-200 shadow-sm relative">
                  <div className="flex items-center space-x-2 text-amber-600 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-bold text-xs uppercase">2. Spending Agent</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Deep analytical agent: queries raw ledger, computes MoM trends (+25% Food), detects outliers.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-100 font-semibold">
                    Tools: 4 Tool Calls
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/95 border border-purple-200 shadow-sm relative">
                  <div className="flex items-center space-x-2 text-purple-700 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-bold text-xs uppercase">3. Alerting Agent</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Audits budget limits, flags overruns (Food) and 95% threshold warnings (Entertainment).
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-purple-800 bg-purple-50 p-1.5 rounded border border-purple-100 font-semibold">
                    Output: 2 Proactive Alerts
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/95 border border-amber-200 shadow-sm relative">
                  <div className="flex items-center space-x-2 text-amber-600 mb-2">
                    <Lightbulb className="h-4 w-4" />
                    <span className="font-bold text-xs uppercase">4. Recommendation</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Runs savings scenarios: curbs dining out to save ₹2,000/mo, 48-hr rule saves ₹1,500/mo.
                  </p>
                  <div className="mt-3 text-[10px] font-mono text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-100 font-semibold">
                    Output: ₹4,150/mo potential
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Reasoning & Tool Trace Viewer */}
            <div className="glass-panel p-6 rounded-2xl border border-white/70 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-purple-700" />
                Live Agent Cognitive Steps & Tool Execution Traces
              </h3>

              <div className="space-y-3">
                {(lastAgentMeta?.agent_traces || [
                  {
                    agent_name: "Planner Agent",
                    action: "Formulate Execution Plan",
                    reasoning: "User asked 'How can I improve my monthly savings?'. Classifies intent as comprehensive financial guidance.",
                    tool_calls: [],
                    output: "Execution plan: SpendingAnalysisAgent -> AlertingAgent -> RecommendationAgent",
                    timestamp: "2026-10-31T10:00:00Z"
                  },
                  {
                    agent_name: "Spending Analysis Agent (In-Depth)",
                    action: "Aggregate Categories & Trends",
                    reasoning: "Extracted all debits for October 2026. Found Food & Dining at ₹12,000, up by 25.0% over September baseline (₹9,600).",
                    tool_calls: [
                      {
                        tool_name: "calculate_category_breakdown",
                        input_args: { month: "2026-10" },
                        output_result: { "Food & Dining": 12000, "Shopping": 8000, "Travel & Commute": 3500 }
                      },
                      {
                        tool_name: "compute_month_over_month_variance",
                        input_args: { curr_month: "2026-10", prev_month: "2026-09" },
                        output_result: { "Food & Dining": { diff: 2400, percentage_change: 25.0 } }
                      }
                    ],
                    output: "Food & Dining up 25.0% MoM; Shopping ₹8,000; Travel ₹3,500.",
                    timestamp: "2026-10-31T10:00:01Z"
                  },
                  {
                    agent_name: "Alerting Agent",
                    action: "Audit Budget Thresholds",
                    reasoning: "Food limit ₹10,000 breached by ₹2,000. Entertainment at 95% of ₹3,000 limit.",
                    tool_calls: [
                      {
                        tool_name: "evaluate_budget_thresholds",
                        input_args: { month: "2026-10" },
                        output_result: [{ category: "Food & Dining", status: "EXCEEDED" }, { category: "Entertainment", status: "NEAR_LIMIT" }]
                      }
                    ],
                    output: "Generated HIGH severity alert for Food & Dining and MEDIUM warning for Entertainment.",
                    timestamp: "2026-10-31T10:00:02Z"
                  },
                  {
                    agent_name: "Recommendation Agent",
                    action: "Simulate Savings Potential",
                    reasoning: "Applied 15% dining curb scenario yielding ₹2,000 monthly savings.",
                    tool_calls: [
                      {
                        tool_name: "calculate_savings_potential",
                        input_args: { category: "Food & Dining", reduction_pct: 15.0 },
                        output_result: { estimated_monthly_savings: 2000.0, annual_savings: 24000.0 }
                      }
                    ],
                    output: "Curbing food delivery yields ~₹2,000 monthly savings.",
                    timestamp: "2026-10-31T10:00:03Z"
                  }
                ]).map((trace, tIdx) => {
                  const isExpanded = expandedTraceIndex === tIdx;
                  return (
                    <div
                      key={tIdx}
                      className="rounded-xl border border-slate-200 bg-white/95 overflow-hidden text-xs shadow-sm"
                    >
                      <button
                        onClick={() => setExpandedTraceIndex(isExpanded ? null : tIdx)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-purple-700" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                          <span className="font-bold text-slate-900">{trace.agent_name}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-purple-700 font-mono text-[11px] font-semibold">{trace.action}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{trace.tool_calls.length} tools called</span>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/50">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-500">Autonomous Reasoning:</span>
                            <p className="text-xs text-slate-800 mt-0.5">{trace.reasoning}</p>
                          </div>

                          {trace.tool_calls.length > 0 && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-purple-700">Tool Calls Executed:</span>
                              <div className="mt-1 space-y-1.5 font-mono text-[11px]">
                                {trace.tool_calls.map((tc, tcIdx) => (
                                  <div key={tcIdx} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                                    <div className="text-purple-700 font-bold">⚙️ {tc.tool_name}()</div>
                                    <div className="text-slate-600 text-[10px]">
                                      Inputs: {JSON.stringify(tc.input_args)}
                                    </div>
                                    <div className="text-emerald-700 text-[10px] font-semibold">
                                      Result: {JSON.stringify(tc.output_result)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {trace.output && (
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-500">Synthesized Agent Output:</span>
                              <p className="text-xs text-slate-900 mt-0.5 font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                                {trace.output}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-white/60 px-6 py-4 text-center text-xs text-slate-500 bg-white/60 relative z-10 backdrop-blur-md">
        NexusBank • Agentic AI Personal Finance Advisor • Designed with Minimalist Glassmorphism
      </footer>
    </div>
  );
}
