import React from 'react';
import { motion } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import SolitaireGame from '../components/SolitaireGame';

const Solitaire: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <SEOHead
        pageTitle="Solitaire Online Free | Classic Card Game | GSL Game Zone"
        pageDescription="Play Solitaire online for free! The classic card game that challenges your strategy. Available in Portuguese, English and Spanish. Play now!"
        pageKeywords="solitaire, card game, klondike solitaire, online game free, cards, strategy, GSL Game Zone"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SolitaireGame />
      </motion.div>
    </div>
  );
};

export default Solitaire;
