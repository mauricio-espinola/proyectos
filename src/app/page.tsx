'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, TarotCard, SelectedCard } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sparkles,
  BookOpen,
  History,
  LogOut,
  Moon,
  Heart,
  Wand2,
  Eye,
  ChevronRight,
  Search,
  User,
  Settings,
  Crown,
  Trophy,
  Target,
  MessageCircle,
  Menu,
  Zap,
  Home as HomeIcon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// ============================================
// AUTH SECTION
// ============================================

function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password }
        : { email, password, name };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pattern-mystic">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Moon className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">Tarot Learning</h1>
          <p className="text-muted-foreground">Descubre la sabiduría de las cartas</p>
        </div>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Ingresa a tu espacio de aprendizaje'
                : 'Únete a nuestra comunidad de aprendizaje'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-muted/50"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin 
                    ? '¿No tienes cuenta? Regístrate'
                    : '¿Ya tienes cuenta? Inicia sesión'
                  }
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-muted/50">
              <p className="text-xs text-center text-muted-foreground mb-2">
                Cuentas de demostración:
              </p>
              <div className="text-xs text-center text-muted-foreground space-y-1">
                <p><span className="text-primary">Admin:</span> admin@tarot.com / admin123</p>
                <p><span className="text-primary">Usuario:</span> demo@tarot.com / demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============================================
// NAVIGATION
// ============================================

function Navigation() {
  const { user, logout, activeSection, setActiveSection } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: HomeIcon },
    { id: 'library', label: 'Cartas', icon: BookOpen },
    { id: 'reading', label: 'Tirada', icon: Wand2 },
    { id: 'history', label: 'Historial', icon: History },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-muted/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline text-gradient-gold">Tarot Learning</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection(item.id as any)}
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user?.name || user?.email}</span>
              {user?.role === 'ADMIN' && (
                <Badge variant="secondary" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-muted/40 py-2"
          >
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => {
                  setActiveSection(item.id as any);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
}

// ============================================
// DASHBOARD SECTION
// ============================================

function DashboardSection() {
  const { user, setActiveSection } = useStore();
  const [recentReadings, setRecentReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/readings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRecentReadings(data.readings?.slice(0, 3) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReadings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 overflow-hidden">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                ¡Bienvenido{user?.name ? `, ${user.name}` : ''}! ✨
              </h1>
              <p className="text-muted-foreground mb-6 max-w-lg">
                Tu viaje de autoconocimiento a través del tarot continúa. 
                Cada lectura es una oportunidad de descubrimiento.
              </p>
              <Button 
                size="lg" 
                onClick={() => setActiveSection('reading')}
                className="gap-2"
              >
                <Wand2 className="w-5 h-5" />
                Nueva Lectura
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'Cartas Vistas', value: user?.cardsViewed || 0, color: 'text-blue-400' },
          { icon: Sparkles, label: 'Lecturas', value: user?.readingsDone || 0, color: 'text-purple-400' },
          { icon: Trophy, label: 'Nivel', value: user?.level || 1, color: 'text-yellow-400' },
          { icon: Zap, label: 'Experiencia', value: user?.experience || 0, color: 'text-green-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card 
            className="cursor-pointer hover:border-primary/30 transition-all hover:scale-[1.02]"
            onClick={() => setActiveSection('library')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Explorar Cartas</h3>
                <p className="text-sm text-muted-foreground">78 cartas para descubrir</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card 
            className="cursor-pointer hover:border-primary/30 transition-all hover:scale-[1.02]"
            onClick={() => setActiveSection('reading')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Hacer Tirada</h3>
                <p className="text-sm text-muted-foreground">Lectura guiada paso a paso</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card 
            className="cursor-pointer hover:border-primary/30 transition-all hover:scale-[1.02]"
            onClick={() => setActiveSection('history')}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <History className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Mi Historial</h3>
                <p className="text-sm text-muted-foreground">Lecturas anteriores</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Readings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Lecturas Recientes</h2>
          <Button variant="ghost" size="sm" onClick={() => setActiveSection('history')}>
            Ver todas
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        ) : recentReadings.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Aún no tienes lecturas</p>
              <Button 
                className="mt-4" 
                onClick={() => setActiveSection('reading')}
              >
                Haz tu primera tirada
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentReadings.map((reading) => (
              <Card key={reading.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium truncate max-w-md">
                        {reading.question?.question || 'Sin pregunta'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reading.startedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {reading.cardResults?.slice(0, 3).map((cr: any) => (
                        <div 
                          key={cr.id}
                          className="w-8 h-12 rounded bg-primary/20 border border-primary/30 flex items-center justify-center text-xs"
                        >
                          {cr.card?.name?.slice(0, 2)}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ============================================
// LIBRARY SECTION
// ============================================

function LibrarySection() {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'major' | 'minor'>('all');
  const [filterSuit, setFilterSuit] = useState<string>('all');
  const { openCardModal } = useStore();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/api/cards');
        const data = await res.json();
        setCards(data.cards);
        setFilteredCards(data.cards);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    let result = cards;
    
    if (search) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      result = result.filter(c => 
        filterType === 'major' ? c.cardType === 'MAJOR_ARCANA' : c.cardType === 'MINOR_ARCANA'
      );
    }
    
    if (filterSuit !== 'all') {
      result = result.filter(c => c.suit === filterSuit);
    }
    
    setFilteredCards(result);
  }, [search, filterType, filterSuit, cards]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Biblioteca de Cartas</h1>
        <p className="text-muted-foreground">
          Explora las 78 cartas del tarot y su significado
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar carta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterType('all'); setFilterSuit('all'); }}
          >
            Todas
          </Button>
          <Button
            variant={filterType === 'major' ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setFilterType('major'); setFilterSuit('all'); }}
          >
            Mayores
          </Button>
          <Button
            variant={filterType === 'minor' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('minor')}
          >
            Menores
          </Button>
        </div>
      </div>

      {filterType === 'minor' && (
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'CUPS', 'SWORDS', 'WANDS', 'PENTACLES'].map((suit) => (
            <Button
              key={suit}
              variant={filterSuit === suit ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterSuit(suit)}
            >
              {suit === 'all' ? 'Todos' : 
               suit === 'CUPS' ? '🍷 Copas' :
               suit === 'SWORDS' ? '⚔️ Espadas' :
               suit === 'WANDS' ? '🪄 Bastos' : '🪙 Oros'}
            </Button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Sparkles className="w-8 h-8 mx-auto animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando cartas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
            >
              <Card 
                className="cursor-pointer hover:border-primary/30 hover:scale-105 transition-all group"
                onClick={() => openCardModal(card)}
              >
                <CardContent className="p-3">
                  <div className="tarot-card tarot-card-back mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary/50 group-hover:text-primary/80 transition-colors">
                      {card.number !== null ? card.number : card.shortName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate text-center">
                    {card.name}
                  </p>
                  <p className="text-xs text-muted-foreground text-center truncate">
                    {card.cardType === 'MAJOR_ARCANA' ? 'Mayor' : 
                     card.suit === 'CUPS' ? 'Copas' :
                     card.suit === 'SWORDS' ? 'Espadas' :
                     card.suit === 'WANDS' ? 'Bastos' : 'Oros'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredCards.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No se encontraron cartas</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// CARD DETAIL MODAL
// ============================================

function CardDetailModal() {
  const { selectedCard, isCardModalOpen, closeCardModal } = useStore();
  const [activeTab, setActiveTab] = useState('meaning');

  if (!selectedCard) return null;

  return (
    <Dialog open={isCardModalOpen} onOpenChange={closeCardModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{selectedCard.name}</DialogTitle>
          <DialogDescription>
            <Badge variant="outline" className="mr-2">
              {selectedCard.cardType === 'MAJOR_ARCANA' ? 'Arcano Mayor' : 'Arcano Menor'}
            </Badge>
            <Badge variant="secondary">
              {selectedCard.suit === 'MAJOR' ? 'Mayor' :
               selectedCard.suit === 'CUPS' ? 'Copas' :
               selectedCard.suit === 'SWORDS' ? 'Espadas' :
               selectedCard.suit === 'WANDS' ? 'Bastos' : 'Oros'}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {/* Keywords */}
            <div className="flex flex-wrap gap-2">
              {selectedCard.keywords.map((keyword, i) => (
                <Badge key={i} variant="outline">{keyword}</Badge>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="meaning">Significado</TabsTrigger>
                <TabsTrigger value="symbols">Símbolos</TabsTrigger>
                <TabsTrigger value="context">Contexto</TabsTrigger>
                <TabsTrigger value="reflect">Reflexión</TabsTrigger>
              </TabsList>

              <TabsContent value="meaning" className="space-y-4">
                <Card className="border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-green-400">Posición Derecha</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedCard.uprightMeaning}</p>
                  </CardContent>
                </Card>

                <Card className="border-red-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-red-400">Posición Invertida</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedCard.reversedMeaning}</p>
                  </CardContent>
                </Card>

                {selectedCard.story && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Historia Simbólica</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground italic">
                        "{selectedCard.story}"
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="symbols" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {selectedCard.description}
                </p>
                {selectedCard.symbols && Object.entries(selectedCard.symbols).map(([symbol, meaning]) => (
                  <Card key={symbol}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold capitalize">{symbol}</h4>
                      <p className="text-sm text-muted-foreground">{meaning}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="context" className="space-y-4">
                {selectedCard.loveMeaning && (
                  <Card className="border-pink-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        Amor y Relaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedCard.loveMeaning}</p>
                    </CardContent>
                  </Card>
                )}
                {selectedCard.careerMeaning && (
                  <Card className="border-yellow-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        Trabajo y Carrera
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedCard.careerMeaning}</p>
                    </CardContent>
                  </Card>
                )}
                {selectedCard.spiritualMeaning && (
                  <Card className="border-purple-500/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Crecimiento Espiritual
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{selectedCard.spiritualMeaning}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reflect" className="space-y-4">
                {selectedCard.lessons && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Lecciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedCard.lessons.map((lesson, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {selectedCard.questions && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Preguntas de Reflexión</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedCard.questions.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// READING SECTION
// ============================================

type ReadingPhase = 'question' | 'shuffling' | 'selecting' | 'revealing' | 'interpreting' | 'completed';

interface ReadingSession {
  question: string;
  category: string;
  cards: SelectedCard[];
  interpretation: string;
  depth: number;
  aspect?: string;
}

// Componente para mostrar tiradas anteriores
function PreviousDrawsCard({ readingHistory, onExpand }: { readingHistory: ReadingSession[], onExpand?: (index: number) => void }) {
  if (readingHistory.length === 0) return null;
  
  return (
    <Card className="mb-6 border-secondary/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="w-4 h-4" />
          Tiradas Anteriores ({readingHistory.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {readingHistory.map((reading, i) => (
          <div key={i} className="mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-0 border-muted/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Tirada {reading.depth} {reading.aspect && `- Profundizando: "${reading.aspect}"`}
              </p>
              {onExpand && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={() => onExpand(i)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver tirada
                </Button>
              )}
            </div>
            {/* Cartas con nombre completo */}
            <div className="flex gap-2">
              {reading.cards.map((c, j) => (
                <div key={j} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full min-w-[70px] h-16 rounded bg-gradient-to-br from-muted/50 to-muted border border-primary/20 flex flex-col items-center justify-center p-1 text-center"
                  >
                    <span className="text-xs font-semibold leading-tight">
                      {c.card.name}
                    </span>
                  </div>
                  {c.isReversed && (
                    <Badge variant="secondary" className="text-[10px] mt-1 bg-red-500/20 text-red-300">Invertida</Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground mt-0.5">{c.positionName}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Componente para el diálogo de tirada expandida
function ExpandedDrawDialog({ 
  expandedDrawIndex, 
  setExpandedDrawIndex, 
  readingHistory, 
  question 
}: { 
  expandedDrawIndex: number | null; 
  setExpandedDrawIndex: (index: number | null) => void;
  readingHistory: ReadingSession[];
  question: string;
}) {
  return (
    <Dialog open={expandedDrawIndex !== null} onOpenChange={(open) => !open && setExpandedDrawIndex(null)}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        {expandedDrawIndex !== null && readingHistory[expandedDrawIndex] && (
          <>
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-secondary" />
                Tirada {readingHistory[expandedDrawIndex].depth}
                {readingHistory[expandedDrawIndex].aspect && ` - "${readingHistory[expandedDrawIndex].aspect}"`}
              </DialogTitle>
              <DialogDescription>{question}</DialogDescription>
            </DialogHeader>
            
            {/* Cartas */}
            <div className="flex justify-center gap-4 px-6 py-4 bg-muted/30">
              {readingHistory[expandedDrawIndex].cards.map((c, j) => (
                <div key={j} className="flex flex-col items-center">
                  <div className={`w-24 h-36 rounded-xl bg-gradient-to-br from-card to-muted border-2 border-secondary/50 flex flex-col items-center justify-center p-2 shadow-lg ${c.isReversed ? 'rotate-180' : ''}`}>
                    <span className="text-[11px] font-bold text-center leading-tight">{c.card.name}</span>
                  </div>
                  {c.isReversed && <Badge variant="secondary" className="mt-1.5 text-[10px] bg-red-500/20 text-red-300">Invertida</Badge>}
                  <span className="text-[10px] text-muted-foreground mt-1">{c.positionName}</span>
                </div>
              ))}
            </div>
            
            {/* Interpretación - texto pequeño, scroll oculto */}
            {readingHistory[expandedDrawIndex].interpretation && (
              <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide" style={{ maxHeight: 'calc(80vh - 280px)' }}>
                <Card className="border-0 shadow-none bg-muted/20">
                  <CardHeader className="py-2 px-3">
                    <CardTitle className="text-xs flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      Interpretación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-3">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-2 leading-relaxed text-[11px]">{children}</p>,
                          h2: ({ children }) => <h2 className="text-xs font-bold mt-3 mb-1 text-foreground">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-[11px] font-semibold mt-2 mb-1 text-foreground">{children}</h3>,
                          strong: ({ children }) => <strong className="text-secondary font-semibold text-[11px]">{children}</strong>,
                          li: ({ children }) => <li className="mb-0.5 ml-2 text-[11px]">{children}</li>,
                        }}
                      >
                        {readingHistory[expandedDrawIndex].interpretation}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ReadingSection() {
  const { user } = useStore();
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [interpretationLoading, setInterpretationLoading] = useState(false);
  const [interpretationError, setInterpretationError] = useState<string>('');
  
  // Reading state
  const [phase, setPhase] = useState<ReadingPhase>('question');
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [interpretation, setInterpretation] = useState<string>('');
  const [currentDepth, setCurrentDepth] = useState(0);
  
  // Second draw state
  const [showSecondDrawWarning, setShowSecondDrawWarning] = useState(false);
  const [secondDrawAspect, setSecondDrawAspect] = useState('');
  const [readingHistory, setReadingHistory] = useState<ReadingSession[]>([]);
  
  // Dialog for expanded draw
  const [expandedDrawIndex, setExpandedDrawIndex] = useState<number | null>(null);
  
  // Maximum draws allowed
  const MAX_DRAWS = 2;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/api/cards');
        const data = await res.json();
        setCards(data.cards);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCards();
  }, []);

  const positionNames = ['Pasado / Origen', 'Presente / Situación', 'Futuro / Consejo'];

  // Start shuffle animation
  const startShuffle = () => {
    setPhase('shuffling');
    // Randomly select 3 cards
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const selected: SelectedCard[] = shuffled.slice(0, 3).map((card, index) => ({
      card,
      position: index,
      positionName: positionNames[index],
      isReversed: Math.random() > 0.7,
    }));
    setSelectedCards(selected);
    
    // After shuffle animation, show cards
    setTimeout(() => {
      setPhase('selecting');
    }, 3000);
  };

  // Reveal a card
  const revealCard = (index: number) => {
    if (revealedCards.includes(index)) return;
    
    const newRevealed = [...revealedCards, index];
    setRevealedCards(newRevealed);
    
    // If all cards revealed, move to interpretation
    if (newRevealed.length === 3) {
      setTimeout(() => {
        setPhase('interpreting');
        getInterpretation(1);
      }, 1000);
    }
  };

  // Get AI interpretation
  const getInterpretation = async (step: number) => {
    setInterpretationLoading(true);
    setInterpretationError('');
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          cards: selectedCards.map(s => ({
            name: s.card.name,
            uprightMeaning: s.card.uprightMeaning,
            reversedMeaning: s.card.reversedMeaning,
            keywords: s.card.keywords,
            position: s.position,
            positionName: s.positionName,
            isReversed: s.isReversed,
          })),
          step,
          aspect: secondDrawAspect || undefined,
          previousReadings: readingHistory.length > 0 ? readingHistory.map(r => ({
            cards: r.cards.map(c => c.card.name),
            aspect: r.aspect,
          })) : undefined,
        }),
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al generar la interpretación');
      }
      
      if (!data.interpretation) {
        throw new Error('No se recibió interpretación del servidor');
      }
      
      setInterpretation(data.interpretation);
      setCurrentDepth(step);
      setPhase('completed');
      // Clear aspect after using it for interpretation
      setSecondDrawAspect('');
    } catch (e: any) {
      console.error('Interpretation error:', e);
      setInterpretationError(e.message || 'Error al generar la interpretación. Por favor, intenta de nuevo.');
      setPhase('completed'); // Still go to completed phase to show error
    } finally {
      setInterpretationLoading(false);
    }
  };

  // Deepen the interpretation - Ahora es una NUEVA tirada
  const startSecondDraw = () => {
    setShowSecondDrawWarning(true);
  };
  
  // Confirm second draw and start shuffling new cards
  const confirmSecondDraw = (aspect: string) => {
    // Save current reading to history
    setReadingHistory(prev => [...prev, {
      question,
      category,
      cards: selectedCards,
      interpretation,
      depth: currentDepth,
      aspect: aspect || undefined,
    }]);
    
    // Set the aspect to focus on
    setSecondDrawAspect(aspect);
    setShowSecondDrawWarning(false);
    
    // Reset for new draw but keep the question context
    setRevealedCards([]);
    setInterpretation('');
    setSelectedCards([]);
    setCurrentDepth(prev => prev + 1);
    
    // Start shuffling new cards
    setPhase('shuffling');
    
    // Select NEW random cards
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const selected: SelectedCard[] = shuffled.slice(0, 3).map((card, index) => ({
      card,
      position: index,
      positionName: positionNames[index],
      isReversed: Math.random() > 0.7,
    }));
    setSelectedCards(selected);
    
    setTimeout(() => {
      setPhase('selecting');
    }, 3000);
  };
  
  // Cancel second draw
  const cancelSecondDraw = () => {
    setShowSecondDrawWarning(false);
    setSecondDrawAspect('');
  };

  // Save reading to history - incluye todas las tiradas de la sesión
  const saveReading = async () => {
    const token = localStorage.getItem('token');
    try {
      // Guardar la tirada actual junto con el historial de tiradas anteriores
      const allDraws = [
        ...readingHistory,
        {
          question,
          category,
          cards: selectedCards,
          interpretation,
          depth: currentDepth,
        }
      ];
      
      await fetch('/api/readings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
          category,
          cards: selectedCards,
          interpretations: [interpretation],
          allDraws, // Enviar todas las tiradas de la sesión
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Reset everything
  const resetReading = () => {
    setPhase('question');
    setQuestion('');
    setCategory('general');
    setSelectedCards([]);
    setRevealedCards([]);
    setInterpretation('');
    setInterpretationError('');
    setCurrentDepth(0);
    setShowSecondDrawWarning(false);
    setSecondDrawAspect('');
    setReadingHistory([]);
  };

  // ============ PHASE: QUESTION ============
  if (phase === 'question') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-4"
          >
            <Moon className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-gold">Nueva Lectura</h1>
          <p className="text-muted-foreground">
            Formula tu pregunta con claridad y apertura
          </p>
        </div>

        <Card className="mb-6 border-primary/20">
          <CardContent className="p-6">
            <label className="block text-sm font-medium mb-2">
              ¿Qué deseas saber?
            </label>
            <Textarea
              placeholder="Escribe tu pregunta aquí..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="mb-4 resize-none"
            />
            
            <label className="block text-sm font-medium mb-3">
              Categoría
            </label>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'general', label: 'General', icon: Sparkles },
                { id: 'love', label: 'Amor', icon: Heart },
                { id: 'career', label: 'Trabajo', icon: Target },
                { id: 'spiritual', label: 'Espiritual', icon: Moon },
              ].map((cat) => (
                <Button
                  key={cat.id}
                  variant={category === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(cat.id)}
                  className="gap-2"
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              ))}
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={startShuffle}
              disabled={!question.trim()}
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Tirar las Cartas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============ PHASE: SHUFFLING ============
  if (phase === 'shuffling') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Texto en la parte superior */}
        <div className="absolute top-8 left-0 right-0 text-center z-10">
          <h1 className="text-2xl font-bold">Barajando las cartas...</h1>
          <p className="text-muted-foreground italic mt-1 max-w-md mx-auto px-4">"{question}"</p>
        </div>

        {/* Animated deck - perfectamente centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: 200, height: 300 }}>
            {/* Stack of cards shuffling */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute w-48 h-72 rounded-xl bg-gradient-to-br from-primary/40 via-primary/20 to-background border-2 border-secondary/40 flex items-center justify-center shadow-xl"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: -96, // -w/2
                  marginTop: -144, // -h/2
                  zIndex: 5 - i,
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  rotate: 0,
                }}
                animate={{
                  x: [
                    0, 
                    i % 2 === 0 ? 120 : -120, 
                    i % 2 === 0 ? -60 : 60,
                    0
                  ],
                  y: [
                    0,
                    i % 2 === 0 ? -40 : 40,
                    i % 2 === 0 ? 30 : -30,
                    0
                  ],
                  rotate: [
                    0,
                    i % 2 === 0 ? 18 : -18,
                    i % 2 === 0 ? -12 : 12,
                    0
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: 0,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              >
                <div className="relative w-full h-full">
                  {/* Decorative pattern */}
                  <div className="absolute inset-3 border border-secondary/30 rounded-lg" />
                  <div className="absolute inset-6 border border-secondary/20 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Moon className="w-16 h-16 text-secondary/50" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Texto en la parte inferior */}
        <motion.p 
          className="absolute bottom-8 left-0 right-0 text-center text-muted-foreground text-sm z-10"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Concentrándote en tu pregunta...
        </motion.p>
      </div>
    );
  }

  // ============ PHASE: SELECTING (Cards face down) ============
  if (phase === 'selecting' || phase === 'revealing') {
    const allRevealed = revealedCards.length === 3;
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Tiradas anteriores - visible durante toda la fase */}
        <PreviousDrawsCard 
          readingHistory={readingHistory} 
          onExpand={(index) => setExpandedDrawIndex(index)}
        />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {allRevealed ? 'Tus Cartas' : 'Revela tus cartas'}
          </h1>
          <p className="text-muted-foreground italic">"{question}"</p>
          {currentDepth > 0 && secondDrawAspect && (
            <Badge variant="outline" className="mt-2">
              Profundizando: {secondDrawAspect}
            </Badge>
          )}
          {!allRevealed && (
            <p className="text-sm text-muted-foreground mt-2">
              Haz clic en cada carta para revelarla
            </p>
          )}
        </div>

        {/* Three cards - Vertical orientation */}
        <div className="flex justify-center gap-4 md:gap-8 mb-8">
          {selectedCards.map((s, index) => {
            const isRevealed = revealedCards.includes(index);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center"
              >
                {/* Position label */}
                <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2 text-center">
                  {s.positionName}
                </p>
                
                {/* Card with flip animation */}
                <div 
                  className="cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={() => !isRevealed && revealCard(index)}
                >
                  <motion.div
                    className="relative"
                    style={{ 
                      width: '160px',
                      height: '240px',
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateY: isRevealed ? 180 : 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                    whileHover={!isRevealed ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!isRevealed ? { scale: 0.95 } : {}}
                  >
                    {/* Card BACK (face down) - visible when NOT revealed */}
                    <div 
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-primary/40 via-primary/20 to-background border-2 border-secondary/40 rounded-xl flex items-center justify-center shadow-lg">
                        <div className="relative w-full h-full">
                          {/* Decorative pattern */}
                          <div className="absolute inset-3 border border-secondary/30 rounded-lg" />
                          <div className="absolute inset-6 border border-secondary/20 rounded-lg" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Moon className="w-16 h-16 text-secondary/50" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card FRONT (face up) - visible when revealed */}
                    <div 
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div 
                        className={`w-full h-full bg-gradient-to-br from-background via-card to-muted border-2 border-secondary/50 rounded-xl flex flex-col items-center justify-center p-4 shadow-lg ${s.isReversed ? 'rotate-180' : ''}`}
                      >
                        {/* Card number/type */}
                        <div className="text-5xl font-bold text-secondary/70 mb-3">
                          {s.card.number !== null ? s.card.number : '★'}
                        </div>
                        
                        {/* Card name */}
                        <p className="text-sm md:text-base font-semibold text-center leading-tight px-2">
                          {s.card.name}
                        </p>
                        
                        {/* Reversed indicator - shows at rotated position */}
                        {s.isReversed && (
                          <Badge variant="secondary" className="mt-3 text-xs bg-red-500/20 text-red-300 border-red-500/30">
                            ⬇ Invertida
                          </Badge>
                        )}
                        
                        {/* Keywords preview */}
                        <div className="mt-3 flex flex-wrap gap-1 justify-center">
                          {s.card.keywords.slice(0, 2).map((k, j) => (
                            <Badge key={j} variant="outline" className="text-[10px] px-2">
                              {k}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Loading indicator while interpreting */}
        {phase === 'revealing' && interpretationLoading && (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <p className="text-muted-foreground mt-2">Interpretando las cartas...</p>
          </div>
        )}
        
        {/* Dialog for expanded draw */}
        <ExpandedDrawDialog 
          expandedDrawIndex={expandedDrawIndex}
          setExpandedDrawIndex={setExpandedDrawIndex}
          readingHistory={readingHistory}
          question={question}
        />
      </div>
    );
  }

  // ============ PHASE: INTERPRETING ============
  if (phase === 'interpreting') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Tiradas anteriores */}
        <PreviousDrawsCard 
          readingHistory={readingHistory} 
          onExpand={(index) => setExpandedDrawIndex(index)}
        />
        
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-primary" />
          </motion.div>
          <h2 className="text-xl font-semibold mb-2">Interpretando tu lectura...</h2>
          <p className="text-muted-foreground">Las cartas están revelando su mensaje</p>
          {secondDrawAspect && (
            <Badge variant="outline" className="mt-2">
              Profundizando: {secondDrawAspect}
            </Badge>
          )}
        </div>
        
        {/* Dialog for expanded draw */}
        <ExpandedDrawDialog 
          expandedDrawIndex={expandedDrawIndex}
          setExpandedDrawIndex={setExpandedDrawIndex}
          readingHistory={readingHistory}
          question={question}
        />
      </div>
    );
  }

  // ============ PHASE: COMPLETED (Show interpretation) ============
  
  // Parse interpretation to extract each card's section (more flexible)
  const parseInterpretationByCard = (text: string, cards: SelectedCard[]): { cardIndex: number; content: string }[] => {
    const sections: { cardIndex: number; content: string }[] = [];
    
    if (!text || cards.length === 0) return sections;
    
    // Try to find card sections by looking for card names with various patterns
    cards.forEach((c, index) => {
      const cardName = c.card.name;
      
      // Try multiple patterns to find the card
      const patterns = [
        new RegExp(`\\*\\*${cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*`, 'i'), // **Card Name*
        new RegExp(`\\*\\*${cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\*\\*`, 'i'), // **Card Name**
        new RegExp(`##\\s*${cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), // ## Card Name
        new RegExp(cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), // Just the name
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match.index !== undefined) {
          sections.push({ 
            cardIndex: index, 
            start: match.index 
          } as any);
          break;
        }
      }
    });
    
    // Sort by position
    sections.sort((a: any, b: any) => a.start - b.start);
    
    // Extract content for each card
    const result: { cardIndex: number; content: string }[] = [];
    sections.forEach((s: any, i) => {
      const nextStart = (sections[i + 1] as any)?.start ?? text.length;
      const content = text.substring(s.start, nextStart).trim();
      if (content) {
        result.push({ cardIndex: s.cardIndex, content });
      }
    });
    
    return result;
  };
  
  const cardSections = parseInterpretationByCard(interpretation, selectedCards);
  
  // If parsing failed, show full interpretation
  const hasParsedSections = cardSections.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={resetReading} className="mb-4">
          ← Nueva Lectura
        </Button>
        <h1 className="text-2xl font-bold mb-2">Tu Lectura</h1>
        <p className="text-muted-foreground italic">"{question}"</p>
      </div>

      {/* Cards Row */}
      <div className="flex justify-center gap-8 mb-6">
        {selectedCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            <p className="text-sm text-muted-foreground mb-2 text-center font-medium">
              {s.positionName}
            </p>
            <div 
              className={`w-40 h-56 rounded-xl bg-gradient-to-br from-background via-card to-muted border-2 border-secondary/50 flex flex-col items-center justify-center p-4 shadow-lg ${s.isReversed ? 'rotate-180' : ''}`}
            >
              <span className="text-5xl font-bold text-secondary/70">
                {s.card.number !== null ? s.card.number : '★'}
              </span>
              <p className="text-sm font-semibold text-center leading-tight mt-2 px-1">
                {s.card.name}
              </p>
            </div>
            {s.isReversed && (
              <Badge variant="secondary" className="mt-2 text-xs bg-red-500/20 text-red-300 border-red-500/30">
                ⬇ Invertida
              </Badge>
            )}
          </motion.div>
        ))}
      </div>

      {/* Interpretation - Full text */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-secondary" />
            Interpretación
            {currentDepth > 0 && (
              <Badge variant="outline" className="text-xs">Nivel {currentDepth}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {interpretationError ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <Zap className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Error al generar la interpretación</p>
                  <p className="text-xs text-muted-foreground mt-1">{interpretationError}</p>
                </div>
              </div>
              <Button 
                onClick={() => getInterpretation(currentDepth || 1)}
                disabled={interpretationLoading}
                className="w-full"
              >
                {interpretationLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                    </motion.div>
                    Reintentando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Reintentar Interpretación
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown 
                components={{
                  p: ({ children }) => <p className="mb-3 leading-relaxed text-sm">{children}</p>,
                  h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1 text-foreground">{children}</h3>,
                  strong: ({ children }) => {
                    // Check if this is a card name
                    const text = String(children);
                    const isCardName = selectedCards.some(s => 
                      text.toLowerCase().includes(s.card.name.toLowerCase()) ||
                      s.card.name.toLowerCase().includes(text.toLowerCase())
                    );
                    
                    if (isCardName) {
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold">
                          {children}
                        </span>
                      );
                    }
                    
                    // Default style for other bold text
                    return (
                      <strong className="text-secondary font-bold">
                        {children}
                      </strong>
                    );
                  },
                  li: ({ children }) => <li className="mb-1 ml-3 text-sm">{children}</li>,
                }}
              >
                {interpretation}
              </ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Depth Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Tiradas</span>
          <span>Tirada {currentDepth}/{MAX_DRAWS}</span>
        </div>
        <Progress value={(currentDepth / MAX_DRAWS) * 100} className="h-2" />
      </div>

      {/* Previous readings in this session - usando el componente */}
      <PreviousDrawsCard 
        readingHistory={readingHistory} 
        onExpand={(index) => setExpandedDrawIndex(index)}
      />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {currentDepth < MAX_DRAWS && (
          <Button
            className="flex-1"
            onClick={startSecondDraw}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Nueva Tirada para Profundizar
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={saveReading}
        >
          <History className="w-4 h-4 mr-2" />
          Guardar en Historial
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={resetReading}
        >
          Nueva Lectura
        </Button>
      </div>

      {/* Dialog for expanded draw */}
      <ExpandedDrawDialog 
        expandedDrawIndex={expandedDrawIndex}
        setExpandedDrawIndex={setExpandedDrawIndex}
        readingHistory={readingHistory}
        question={question}
      />

      {/* Second Draw Warning Dialog */}
      <Dialog open={showSecondDrawWarning} onOpenChange={(open) => !open && cancelSecondDraw()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              Segunda Tirada
            </DialogTitle>
            <DialogDescription className="text-left pt-2">
              Una segunda tirada te permite explorar más profundamente tu pregunta con cartas nuevas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Rules */}
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm font-medium text-green-400 mb-2">✓ Haz segunda tirada si:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Quedó una duda concreta</li>
                  <li>• Quieres profundizar una carta o un aspecto</li>
                  <li>• La lectura pide más detalle</li>
                </ul>
              </div>
              
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm font-medium text-red-400 mb-2">✗ No la hagas si:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• La primera ya fue clara</li>
                  <li>• Solo buscas confirmación</li>
                  <li>• Empiezas a depender de seguir sacando cartas</li>
                </ul>
              </div>
            </div>

            {/* Aspect to focus on */}
            <div className="space-y-2">
              <label className="text-sm font-medium">¿Qué aspecto deseas profundizar?</label>
              <Textarea
                placeholder="Describe brevemente qué quieres explorar... (opcional)"
                value={secondDrawAspect}
                onChange={(e) => setSecondDrawAspect(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={cancelSecondDraw}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1"
              onClick={() => confirmSecondDraw(secondDrawAspect)}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Barajar Nuevas Cartas
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// HISTORY SECTION
// ============================================

function HistorySection() {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/readings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReadings(data.readings || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReadings();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Sparkles className="w-8 h-8 mx-auto animate-pulse text-primary" />
        <p className="mt-4 text-muted-foreground">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Historial de Lecturas</h1>
      <p className="text-muted-foreground mb-8">
        Revisa tus lecturas anteriores y reflexiona sobre tu camino
      </p>

      {readings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Aún no tienes lecturas guardadas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {readings.map((reading, i) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setExpandedId(expandedId === reading.id ? null : reading.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium truncate pr-4">
                        {reading.question?.question || 'Sin pregunta'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reading.startedAt).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      {/* Badge para indicar múltiples tiradas */}
                      {reading.cardResults?.length > 3 && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {Math.ceil(reading.cardResults.length / 3)} tiradas
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Mostrar cartas en miniatura - máx 6 cartas */}
                      {reading.cardResults?.slice(0, 6).map((cr: any, idx: number) => (
                        <div 
                          key={cr.id || idx}
                          className="w-10 h-14 rounded bg-gradient-to-br from-muted/50 to-muted border border-primary/20 flex flex-col items-center justify-center p-0.5 text-center relative"
                        >
                          <span className="text-[9px] font-semibold leading-tight line-clamp-2">
                            {cr.card?.name?.split(' ')[0]}
                          </span>
                          {cr.isReversed && (
                            <span className="absolute -bottom-1 text-[8px] text-red-400">⬇</span>
                          )}
                        </div>
                      ))}
                      {reading.cardResults?.length > 6 && (
                        <span className="text-xs text-muted-foreground ml-1">+{reading.cardResults.length - 6}</span>
                      )}
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ml-2 ${expandedId === reading.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {expandedId === reading.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-muted"
                    >
                      {/* Agrupar cartas por tirada (grupos de 3) */}
                      {(() => {
                        const cardResults = reading.cardResults || [];
                        const numDraws = Math.ceil(cardResults.length / 3);
                        
                        return Array.from({ length: numDraws }, (_, drawIndex) => {
                          const drawCards = cardResults.slice(drawIndex * 3, (drawIndex + 1) * 3);
                          const interp = reading.interpretations?.[drawIndex];
                          
                          return (
                            <div key={drawIndex} className="mb-6 last:mb-0">
                              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Badge variant="outline">Tirada {drawIndex + 1}</Badge>
                                {interp?.focus && <span className="text-muted-foreground text-xs">{interp.focus}</span>}
                              </h4>
                              
                              {/* Cartas de esta tirada */}
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                {drawCards.map((cr: any) => (
                                  <div key={cr.id} className="text-center">
                                    <div className={`w-full h-20 rounded-lg bg-gradient-to-br from-card to-muted border border-primary/20 flex flex-col items-center justify-center p-2 mb-1 ${cr.isReversed ? 'rotate-180' : ''}`}>
                                      <span className="text-xs font-semibold leading-tight text-center">
                                        {cr.card?.name}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{cr.positionName}</p>
                                    {cr.isReversed && (
                                      <Badge variant="secondary" className="text-[10px] mt-0.5">Invertida</Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              {/* Interpretación de esta tirada */}
                              {interp?.content && (
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground bg-muted/30 rounded-lg p-3">
                                  <ReactMarkdown 
                                    components={{
                                      p: ({ children }) => <p className="text-xs mb-2 last:mb-0">{children}</p>,
                                      h2: ({ children }) => <h2 className="text-sm font-bold mt-2 mb-1">{children}</h2>,
                                      h3: ({ children }) => <h3 className="text-xs font-semibold mt-2 mb-1">{children}</h3>,
                                    }}
                                  >
                                    {interp.content}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// ADMIN SECTION
// ============================================

function AdminSection() {
  const { user } = useStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data.users || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Acceso restringido a administradores</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
      <p className="text-muted-foreground mb-8">
        Gestiona usuarios y contenido de la aplicación
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <User className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-xs text-muted-foreground">Usuarios Registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <BookOpen className="w-5 h-5 text-secondary mb-2" />
            <p className="text-2xl font-bold">78</p>
            <p className="text-xs text-muted-foreground">Cartas en el Mazo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Sparkles className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold">
              {users.reduce((sum, u) => sum + (u.readingsDone || 0), 0)}
            </p>
            <p className="text-xs text-muted-foreground">Lecturas Totales</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4 text-muted-foreground">Cargando...</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{u.name || u.email}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {u.role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {u.readingsDone} lecturas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// FOOTER
// ============================================

function Footer() {
  return (
    <footer className="mt-auto border-t border-muted/40 bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            <span>Tarot Learning App</span>
          </div>
          <p>Creado con ✨ para el aprendizaje y la reflexión</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN APP
// ============================================

export default function TarotApp() {
  const { isAuthenticated, user, setUser, activeSection } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (e) {
          console.error(e);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Moon className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthSection />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'library' && <LibrarySection />}
            {activeSection === 'reading' && <ReadingSection />}
            {activeSection === 'history' && <HistorySection />}
            {activeSection === 'admin' && <AdminSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <CardDetailModal />
    </div>
  );
}
