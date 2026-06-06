import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`flex items-center transition-all duration-300 hover:scale-105 ${className || ""}`}
    >
      <Image 
        src="/images/logo.png" // Assurez-vous que l'image est bien dans /public et se nomme logo.png
        alt="Logo Kimia Events Team"
        
        // Dimensions maximales de sauvegarde pour Next.js (le ratio de base)
        width={150}              
        height={110}             
        
        // TAILLE RESPONSIVE :
        // Sur mobile (par défaut) : Hauteur de 44px (h-11)
        // Sur ordinateur (md:)     : Hauteur de 64px (h-16)
        className="h-11 md:h-16 w-auto object-contain" 
        priority
      />
    </Link>
  )
}