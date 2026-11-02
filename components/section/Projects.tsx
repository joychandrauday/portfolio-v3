"use client";

import React from "react";
import SelectedWork from "@/components/SelectedWork";

export default function Projects() {
  return (
    <section id="projects" className="py-12 border-b border-border/60">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Projects</h2>
        {/* Reuse the existing SelectedWork component which already filters featured projects */}
        <SelectedWork />
      </div>
    </section>
  );
}
