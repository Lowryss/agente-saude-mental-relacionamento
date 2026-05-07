"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import {
  X,
  User,
  Heart,
  FileText,
  Target,
  Smile,
  Camera,
  Upload,
  Settings,
  Trash2,
} from "lucide-react";

// Helper component for motion div with proper typing
const MotionDiv = motion.div as any;

export interface ChatContext {
  userName: string;
  partnerName: string;
  relationshipType: string;
  situation: string;
  desiredOutcome: string;
  feelings: string;
  photos: string[];
}

interface ChatContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ChatContext;
  onSave: (context: ChatContext) => void;
}

const RELATIONSHIP_TYPES = [
  "Namoro",
  "Noivado",
  "Casamento",
  "Relacionamento aberto",
  "Relacionamento à distância",
  "Ficante",
  "Ex-namorado(a)",
  "Crush",
  "Outro",
];

export default function ChatContextModal({
  isOpen,
  onClose,
  context,
  onSave,
}: ChatContextModalProps) {
  const [formData, setFormData] = useState<ChatContext>(context);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(context);
    }
  }, [isOpen, context]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("Foto muito grande. Máximo 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, base64].slice(0, 5), // Max 5 photos
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ margin: "auto" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Personalizar Contexto
                  </h2>
                  <p className="text-sm text-slate-500">
                    Ajude o mentor a entender melhor sua situação
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* Nomes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <User className="w-4 h-4" />
                    Seu nome
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Como devo te chamar?"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Heart className="w-4 h-4" />
                    Nome da pessoa
                  </label>
                  <input
                    type="text"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleChange}
                    placeholder="Nome do parceiro(a)"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* Tipo de relacionamento */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Heart className="w-4 h-4" />
                  Tipo de relacionamento
                </label>
                <select
                  name="relationshipType"
                  value={formData.relationshipType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none bg-white"
                >
                  <option value="">Selecione...</option>
                  {RELATIONSHIP_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Situação */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FileText className="w-4 h-4" />
                  Situação atual
                </label>
                <textarea
                  name="situation"
                  value={formData.situation}
                  onChange={handleChange}
                  placeholder="Descreva brevemente o que está acontecendo..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none resize-none"
                />
              </div>

              {/* Resultado desejado */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Target className="w-4 h-4" />
                  O que você deseja resolver?
                </label>
                <textarea
                  name="desiredOutcome"
                  value={formData.desiredOutcome}
                  onChange={handleChange}
                  placeholder="Ex: Quero melhorar a comunicação, entender se devo continuar, etc..."
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none resize-none"
                />
              </div>

              {/* Sentimentos */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Smile className="w-4 h-4" />
                  Como você está se sentindo?
                </label>
                <input
                  type="text"
                  name="feelings"
                  value={formData.feelings}
                  onChange={handleChange}
                  placeholder="Ex: Ansiosa, confusa, frustrada, esperançosa..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none"
                />
              </div>

              {/* Fotos */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Camera className="w-4 h-4" />
                  Fotos para contexto (opcional)
                </label>
                <p className="text-xs text-slate-500">
                  Adicione prints de conversas ou fotos relevantes. Máx 5 fotos, 5MB cada.
                </p>

                <div className="flex flex-wrap gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {formData.photos.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-brand-400 hover:bg-brand-50 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-xs text-slate-400">Adicionar</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium transition-colors"
              >
                Salvar Contexto
              </button>
            </div>
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
}
