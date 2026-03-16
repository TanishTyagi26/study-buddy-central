import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const subjects = [
  { emoji: "📐", name: "Mathematics", desc: "Calculus, algebra, statistics" },
  { emoji: "⚛️", name: "Physics", desc: "Mechanics, thermodynamics, quantum" },
  { emoji: "🧬", name: "Biology", desc: "Cell biology, genetics, ecology" },
  { emoji: "⚗️", name: "Chemistry", desc: "Organic, inorganic, physical chem" },
  { emoji: "💻", name: "Computer Science", desc: "Programming, algorithms, OS" },
  { emoji: "🤖", name: "AI / ML", desc: "Machine learning, deep learning" },
  { emoji: "📊", name: "Data Structures", desc: "Arrays, trees, graphs, sorting" },
  { emoji: "📈", name: "Statistics", desc: "Probability, distributions, tests" },
  { emoji: "💰", name: "Economics", desc: "Micro, macro, econometrics" },
  { emoji: "📚", name: "History", desc: "World history, civilizations" },
  { emoji: "🌍", name: "Geography", desc: "Physical, human, GIS" },
  { emoji: "🔤", name: "English", desc: "Literature, grammar, writing" },
];

export default function GroupsPage() {
  const navigate = useNavigate();
  return (
    <MainLayout title="Groups" subtitle="Browse subject communities">
      <div className="p-4 md:p-6 max-w-6xl mx-auto pb-20 md:pb-6 space-y-6">
        <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Browse by Subject</h3>
            <p className="text-sm text-muted-foreground">Find notes from your subject community</p>
          </div>
          <Button className="gradient-primary text-white shrink-0 hidden sm:flex" onClick={() => navigate("/search")}>
            Search Notes
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {subjects.map(s => (
            <button
              key={s.name}
              onClick={() => navigate(`/search?subject=${encodeURIComponent(s.name)}`)}
              className="bg-card rounded-2xl border border-border p-4 text-left hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-2 block">{s.emoji}</span>
              <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{s.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
