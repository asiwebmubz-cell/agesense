import { createProgramSchema } from './src/validators/programs.validator';

const testPayload = {
  type: "Our Programs",
  title: "Project Hope",
  description: "This is a test description of more than 10 chars",
  image_url: undefined,
  status: "Published",
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
};

const result = createProgramSchema.safeParse(testPayload);
if (result.success) {
  console.log('✅ Validation Succeeded!');
} else {
  console.log('❌ Validation Failed:', result.error.format());
}
