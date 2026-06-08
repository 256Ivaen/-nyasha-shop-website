import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import ScrollToTop from '@/components/ScrollToTop'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchBar />
      <ScrollToTop />
      {/* pt accounts for fixed navbar: announcement bar + header row 1 + row 2 (desktop nav) */}
      <main className="flex-grow px-4 sm:px-[5vw] pt-36 lg:pt-44">
        {children}
      </main>
      <Footer />
    </div>
  )
}
