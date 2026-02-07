import React, { useState } from 'react';
import projectData from '../data/projects.json';

const ProjectModal = ({ contentKey, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const data = projectData[contentKey];

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-white">{data.title}</h2>
            <p className="text-slate-400 text-sm">{data.subtitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {data.projects.map((project) => (
            <div key={project.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/30">
              <button 
                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-semibold text-blue-400">{project.name}</span>
                <span className="text-slate-500">{selectedProject === project.id ? '↑' : '↓'}</span>
              </button>

              {selectedProject === project.id && (
                <div className="p-4 border-t border-slate-800 bg-slate-900/50 animate-fadeIn">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.map(t => <span key={t} className="text-[10px] bg-blue-900/30 text-blue-300 px-2 py-1 rounded-md border border-blue-800/50">{t}</span>)}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">{project.description}</p>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
                  >
                    VIEW PROJECT ON GITHUB
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-800/30 text-center text-[10px] text-slate-500 uppercase tracking-widest">
          Press ESC or Click Close to Return to Game
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;