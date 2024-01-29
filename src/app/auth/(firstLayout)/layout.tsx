import Verification_Card from '@/components/verification_card'
import '@/styles/auth-layout.css'

export default function FirstLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="auth_main_container">
            <section className="auth_principal_container">
                <div className="auth_poster_card">
                    
                </div>
                <div className="auth_children_container">
                    {children}
                </div>
            </section>
            <Verification_Card/>
        </main>
    )
}