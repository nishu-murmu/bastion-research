import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/generic/Header'; // ✅ Import Header
import Footer from '@/components/generic/Footer'; // ✅ Import Footer

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col">
      {/* ✅ Custom App Header */}
      <Header />

      {/* ✅ Hero Section */}
      <main className="flex-grow">
        <header className="flex justify-between items-center p-6">
          {/* Logo/Title */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MyApp
          </h1>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <Button asChild variant="outline">
                <Link to="/auth?mode=sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?mode=sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
          </div>
        </header>

        {/* ✅ Main Content */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-2xl px-4">
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Welcome to your new app
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start building something amazing with modern authentication and beautiful design
            </p>

            {/* CTA Buttons based on auth state */}
            <SignedOut>
              <Button asChild size="lg" className="mr-4">
                <Link to="/auth?mode=sign-up">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/auth?mode=sign-in">Sign In</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <div className="bg-card p-8 rounded-lg border shadow-sm">
                <h3 className="text-2xl font-semibold mb-4">Welcome back!</h3>
                <p className="text-muted-foreground mb-6">
                  You're successfully signed in. Access your dashboard below.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <Link to="/edit-profile">Edit Profile</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/subscription">Subscription</Link>
                  </Button>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </main>

      {/* ✅ Custom App Footer */}
      <Footer />
    </div>
  );
};

export default Index;
