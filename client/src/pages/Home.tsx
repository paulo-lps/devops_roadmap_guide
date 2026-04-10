import { useEffect, useState } from 'react';
import { BookOpen, Github, Zap } from 'lucide-react';
import { useRoadmapProgress, RoadmapCategory } from '@/hooks/useRoadmapProgress';
import { RoadmapCategoryComponent } from '@/components/RoadmapCategory';
import { OverallProgress } from '@/components/OverallProgress';
import { ImportanceFilter, ImportanceLevel } from '@/components/ImportanceFilter';

const initialRoadmapData: RoadmapCategory[] = [
  {
    id: 1,
    category: "Learn Programming Languages",
    items: [
      {name: "Python", importance: "Very Important", completed: false},
      {name: "Golang", importance: "Important", completed: false},
      {name: "JavaScript", importance: "Important", completed: false},
      {name: "Ruby", importance: "Normal", completed: false}
    ]
  },
  {
    id: 2,
    category: "Server Administration",
    items: [
      {name: "Linux", importance: "Very Important", completed: false},
      {name: "Unix", importance: "Important", completed: false},
      {name: "Windows", importance: "Normal", completed: false}
    ]
  },
  {
    id: 3,
    category: "Network and Security",
    items: [
      {name: "TCP/IP Fundamental", importance: "Very Important", completed: false},
      {name: "Protocols, DNS, HTTP/s, FTP, SSL...", importance: "Important", completed: false}
    ]
  },
  {
    id: 4,
    category: "Servers",
    subcategories: [
      {
        name: "Web Server",
        items: [
          {name: "Apache", importance: "Very Important", completed: false},
          {name: "Nginx", importance: "Very Important", completed: false},
          {name: "Tomcat", importance: "Important", completed: false},
          {name: "IIS", importance: "Normal", completed: false},
          {name: "Jetty", importance: "Normal", completed: false}
        ]
      },
      {
        name: "Caching",
        items: [
          {name: "Redis", importance: "Very Important", completed: false},
          {name: "Memcache", importance: "Important", completed: false}
        ]
      },
      {
        name: "Database",
        subcategories: [
          {
            name: "NoSQL",
            items: [
              {name: "MongoDB", importance: "Very Important", completed: false},
              {name: "Cassandra", importance: "Important", completed: false},
              {name: "AWS DynamoDB", importance: "Important", completed: false},
              {name: "Google Datastore", importance: "Normal", completed: false}
            ]
          },
          {
            name: "SQL",
            items: [
              {name: "Oracle DB", importance: "Important", completed: false},
              {name: "MySQL/MariaDB", importance: "Very Important", completed: false},
              {name: "PostgreSQL", importance: "Very Important", completed: false},
              {name: "MS-SQL", importance: "Normal", completed: false}
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    category: "Infrastructure as Code",
    subcategories: [
      {
        name: "Configuration Management",
        items: [
          {name: "Ansible", importance: "Very Important", completed: false},
          {name: "Puppet", importance: "Important", completed: false},
          {name: "Chef", importance: "Important", completed: false},
          {name: "Salt Stack", importance: "Normal", completed: false}
        ]
      },
      {
        name: "Container",
        items: [
          {name: "Docker", importance: "Very Important", completed: false},
          {name: "rkt", importance: "Normal", completed: false},
          {name: "LXC", importance: "Normal", completed: false}
        ]
      },
      {
        name: "Container Orchestrator",
        items: [
          {name: "Kubernetes", importance: "Very Important", completed: false},
          {name: "Openshift", importance: "Important", completed: false},
          {name: "NoMad", importance: "Normal", completed: false},
          {name: "Docker Swarm", importance: "Normal", completed: false}
        ]
      },
      {
        name: "Infrastructure Provisioning",
        items: [
          {name: "Terraform", importance: "Very Important", completed: false},
          {name: "AWS Cloudformation", importance: "Important", completed: false},
          {name: "Azure Template", importance: "Important", completed: false},
          {name: "Google Deployment Manager", importance: "Normal", completed: false}
        ]
      }
    ]
  },
  {
    id: 6,
    category: "CI/CD",
    items: [
      {name: "Jenkins", importance: "Very Important", completed: false},
      {name: "TeamCity", importance: "Important", completed: false},
      {name: "Circle CI", importance: "Important", completed: false},
      {name: "Travis CI", importance: "Important", completed: false},
      {name: "AWS Code pipeline", importance: "Important", completed: false},
      {name: "Google Cloud Build", importance: "Important", completed: false},
      {name: "GitLab", importance: "Very Important", completed: false},
      {name: "Bitbucket Pipeline", importance: "Important", completed: false},
      {name: "Github Action", importance: "Very Important", completed: false}
    ]
  },
  {
    id: 7,
    category: "Monitoring and Logging",
    subcategories: [
      {
        name: "Monitoring",
        items: [
          {name: "Zabbix", importance: "Important", completed: false},
          {name: "Prometheus", importance: "Very Important", completed: false},
          {name: "Grafana", importance: "Very Important", completed: false},
          {name: "DataDog", importance: "Important", completed: false},
          {name: "New Relic", importance: "Important", completed: false},
          {name: "CheckMK", importance: "Normal", completed: false}
        ]
      },
      {
        name: "Logging",
        items: [
          {name: "ELK", importance: "Very Important", completed: false},
          {name: "Graylog", importance: "Important", completed: false},
          {name: "Splunk", importance: "Important", completed: false}
        ]
      }
    ]
  },
  {
    id: 8,
    category: "Clouds",
    items: [
      {name: "AWS", importance: "Very Important", completed: false},
      {name: "Azure", importance: "Very Important", completed: false},
      {name: "GCP", importance: "Very Important", completed: false},
      {name: "OpenStack", importance: "Normal", completed: false},
      {name: "Oracle", importance: "Normal", completed: false},
      {name: "IBM Bluemix", importance: "Normal", completed: false}
    ]
  }
];

export default function Home() {
  const { 
    data, 
    loaded, 
    toggleItem, 
    updateNotes, 
    updateImportance, 
    addItem, 
    removeItem, 
    getProgress, 
    getOverallProgress 
  } = useRoadmapProgress(initialRoadmapData);
  
  const [filter, setFilter] = useState<ImportanceLevel | 'all'>('all');
  const [filteredData, setFilteredData] = useState<RoadmapCategory[]>([]);

  useEffect(() => {
    if (!loaded) return;

    if (filter === 'all') {
      setFilteredData(data);
    } else {
      const filtered = data.map(category => {
        const filterItems = (items: any[]) => {
          return items.filter(item => item.importance === filter);
        };

        const filterSubcategories = (subcategories: any[]): any[] => {
          return subcategories
            .map(sub => ({
              ...sub,
              items: sub.items ? filterItems(sub.items) : [],
              subcategories: sub.subcategories ? filterSubcategories(sub.subcategories) : undefined,
            }))
            .filter(sub => (sub.items && sub.items.length > 0) || (sub.subcategories && sub.subcategories.some((s: any) => s.items && s.items.length > 0)));
        };

        return {
          ...category,
          items: category.items ? filterItems(category.items) : undefined,
          subcategories: category.subcategories ? (filterSubcategories(category.subcategories) as any) : undefined,
        };
      }).filter(category => {
        const hasItems = category.items && category.items.length > 0;
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;
        return hasItems || hasSubcategories;
      });

      setFilteredData(filtered);
    }
  }, [filter, data, loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Zap size={40} className="text-[#E20074]" />
          </div>
          <p className="text-gray-600 font-medium">Carregando seu guia...</p>
        </div>
      </div>
    );
  }

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <header className="bg-white border-b-4 border-[#E20074] sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#E20074] rounded-sm p-2">
                <BookOpen size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#333333] tracking-tight">Guia de Estudos</h1>
                <p className="text-xs font-bold text-[#E20074] uppercase tracking-widest">T-Systems do Brasil</p>
              </div>
            </div>
            <a
              href="https://github.com/paulo-lps/devops_roadmap_guide"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-[#E20074] transition-colors"
              title="GitHub"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Progress */}
        <div className="mb-8">
          <OverallProgress
            completed={overallProgress.completed}
            total={overallProgress.total}
            percentage={overallProgress.percentage}
          />
        </div>

        {/* Filter */}
        <div className="mb-8">
          <ImportanceFilter selected={filter} onChange={setFilter} />
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600 font-medium">
                Nenhum tópico encontrado para este filtro.
              </p>
              <button
                onClick={() => setFilter('all')}
                className="mt-4 px-6 py-2 bg-[#E20074] text-white font-bold rounded-sm hover:bg-[#c00062] transition-colors shadow-sm"
              >
                Limpar Filtro
              </button>
            </div>
          ) : (
            filteredData.map(category => (
              <RoadmapCategoryComponent
                key={category.id}
                category={category}
                progress={getProgress(category.id)}
                onToggleItem={toggleItem}
                onUpdateNotes={updateNotes}
                onUpdateImportance={updateImportance}
                onAddItem={addItem}
                onRemoveItem={removeItem}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} T-Systems do Brasil - Guia de Estudos DevOps/SRE
          </p>
          <p className="mt-2">
            Baseado no roadmap de{' '}
            <a
              href="https://twitter.com/BrijPandey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E20074] hover:underline font-bold"
            >
              Brij Kishore Pandey
            </a>
          </p>
          <p className="mt-2">Seu progresso e alterações são salvos automaticamente no navegador</p>
        </footer>
      </main>
    </div>
  );
}
