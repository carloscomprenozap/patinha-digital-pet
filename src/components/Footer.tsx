
import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Conectando tutores e veterinários para o melhor cuidado domiciliar para seu pet.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre</Link></li>
              <li><Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">Para Profissionais</h4>
            <ul className="space-y-2">
              <li><Link to="/cadastro-veterinario" className="text-sm text-muted-foreground hover:text-primary transition-colors">Seja um veterinário parceiro</Link></li>
              <li><Link to="/como-funciona" className="text-sm text-muted-foreground hover:text-primary transition-colors">Como funciona</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><Link to="/ajuda" className="text-sm text-muted-foreground hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link to="/politica-privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VetCasa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
