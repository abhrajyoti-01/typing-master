import TypingTest from "@/components/typing-test"
import Footer from "@/components/footer"
import GitHubButton from "@/components/github-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-end mb-4">
          <GitHubButton />
        </div>
        <TypingTest />
        <Footer />
      </div>
    </main>
  )
}
