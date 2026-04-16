import { fetchGitHubTrends, TrendCategory } from '../src/lib/fetcher';
import * as fs from 'fs';
import * as path from 'path';

const categories: TrendCategory[] = ['all-time', 'monthly', 'recently-active', 'trending'];

async function generateStaticData() {
  const publicDataDir = path.join(process.cwd(), 'public', 'data');
  
  // 确保目录存在
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  console.log('🔄 Generating static data files...\n');

  for (const category of categories) {
    try {
      console.log(`📦 Fetching ${category}...`);
      const projects = await fetchGitHubTrends(category);
      
      const filePath = path.join(publicDataDir, `${category}.json`);
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
      
      console.log(`✅ Generated ${category}.json (${projects.length} projects)`);
    } catch (error) {
      console.error(`❌ Failed to generate ${category}.json:`, error);
    }
  }

  console.log('\n✨ Static data generation completed!');
}

generateStaticData().catch(console.error);
