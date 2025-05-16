import TypingTest from "@/components/typing-test"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10">
        <TypingTest />
        <Footer />
      </div>
    </main>
  )
}
