import '@/styles/auth-layout.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="auth_main_container">
            <section className="auth_principal_container">
                <div className="auth_poster_card">
                    
                </div>
                <div className="auth_children_container">
                    {children}
                </div>
            </section>
        </main>
    )
}