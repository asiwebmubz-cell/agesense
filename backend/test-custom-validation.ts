import { createProgramSchema } from './src/validators/programs.validator';

const runTest = (name: string, payload: any) => {
  const result = createProgramSchema.safeParse(payload);
  if (result.success) {
    console.log(`✅ [${name}] Succeeded`);
  } else {
    console.log(`❌ [${name}] Failed:`, JSON.stringify(result.error.format(), null, 2));
  }
};

// Case 1: Simple Our Work post without extra fields
runTest('Our Work Simple', {
  type: 'Our Work',
  title: 'Project Hope',
  description: 'Helping senior citizens with daily tasks.',
  status: 'Published',
  images: []
});

// Case 2: Our Programs with all extra fields blank/empty strings
runTest('Our Programs Blank Extra Fields', {
  type: 'Our Programs',
  title: 'Project Ihsan',
  description: 'Delivering packages to seniors in need.',
  status: 'Published',
  images: [],
  subtitle: "",
  video_url: undefined,
  goals: "",
  beneficiaries: "",
  expense_categories: "",
  project_areas: "",
  duration: "",
  active_years: "",
  packages_distributed: "",
  gallery_title_1: "",
  gallery_link_1: undefined,
  gallery_title_2: "",
  gallery_link_2: undefined,
  gallery_description: ""
});

// Case 3: Omitted subtitle/optional fields when type is Our Programs
runTest('Our Programs Omitted Fields', {
  type: 'Our Programs',
  title: 'Project Joy',
  description: 'Music sessions for seniors in community centers.',
  status: 'Published',
  images: []
});

// Case 4: Invalid URL formats
runTest('Invalid Video URL format', {
  type: 'Our Programs',
  title: 'Project Joy',
  description: 'Music sessions for seniors in community centers.',
  status: 'Published',
  images: [],
  video_url: "youtube.com/watch?v=123"
});
