export interface SkillCategory {
  name: string
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Cloud & Infrastructure',
    skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'Helm'],
  },
  {
    name: 'CI/CD',
    skills: ['Jenkins', 'GitHub Actions', 'CircleCI', 'ArgoCD'],
  },
  {
    name: 'Observability',
    skills: ['Prometheus', 'VictoriaMetrics', 'Grafana', 'Istio'],
  },
  {
    name: 'Languages & Tools',
    skills: ['Python', 'Bash', 'Go', 'Git'],
  },
]
