-- Insert initial categories
INSERT INTO categories (slug, name, icon, display_order) VALUES
  ('customer-service', '{"en": "Customer Service", "de": "Kundenservice", "fr": "Service Client", "it": "Servizio Clienti"}', 'Headphones', 1),
  ('legal', '{"en": "Legal", "de": "Rechtlich", "fr": "Juridique", "it": "Legale"}', 'Scale', 2),
  ('technical-support', '{"en": "Technical Support", "de": "Technischer Support", "fr": "Support Technique", "it": "Supporto Tecnico"}', 'Wrench', 3),
  ('translation', '{"en": "Translation", "de": "Übersetzung", "fr": "Traduction", "it": "Traduzione"}', 'Languages', 4),
  ('data-analysis', '{"en": "Data Analysis", "de": "Datenanalyse", "fr": "Analyse de Données", "it": "Analisi Dati"}', 'ChartBar', 5),
  ('content-creation', '{"en": "Content Creation", "de": "Content-Erstellung", "fr": "Création de Contenu", "it": "Creazione Contenuti"}', 'PenTool', 6),
  ('education', '{"en": "Education", "de": "Bildung", "fr": "Éducation", "it": "Educazione"}', 'GraduationCap', 7),
  ('healthcare', '{"en": "Healthcare", "de": "Gesundheitswesen", "fr": "Santé", "it": "Sanità"}', 'Heart', 8),
  ('finance', '{"en": "Finance", "de": "Finanzen", "fr": "Finance", "it": "Finanza"}', 'DollarSign', 9),
  ('marketing', '{"en": "Marketing", "de": "Marketing", "fr": "Marketing", "it": "Marketing"}', 'Megaphone', 10),
  ('sales', '{"en": "Sales", "de": "Vertrieb", "fr": "Ventes", "it": "Vendite"}', 'ShoppingCart', 11),
  ('hr', '{"en": "Human Resources", "de": "Personalwesen", "fr": "Ressources Humaines", "it": "Risorse Umane"}', 'Users', 12),
  ('project-management', '{"en": "Project Management", "de": "Projektmanagement", "fr": "Gestion de Projet", "it": "Gestione Progetti"}', 'Briefcase', 13),
  ('research', '{"en": "Research", "de": "Forschung", "fr": "Recherche", "it": "Ricerca"}', 'Search', 14),
  ('automation', '{"en": "Automation", "de": "Automatisierung", "fr": "Automatisation", "it": "Automazione"}', 'Zap', 15)
ON CONFLICT (slug) DO NOTHING;