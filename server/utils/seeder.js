import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Team from '../models/Team.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import FileUpload from '../models/FileUpload.js';

dotenv.config();

// ===== Connect DB =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  }
};

// ===== Helper: random date =====
const daysFromNow = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

// ===== USERS =====
const seedUsers = async () => {
  console.log('🌱 Seeding users...');
  await User.deleteMany();

  const password = await bcrypt.hash('123456', 10);

  const users = await User.insertMany([
   {
  name: 'Sarah Smither',
  email: 'sarah@synchro.com',
  password,
  role: 'admin',
  jobTitle: 'Product Designer',
  bio: 'Designer & product lead passionate about clean UX.',
  isEmailVerified: true,
  avatar: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', publicId: '' },
  subscription: {
    plan: 'business',
    status: 'active',
    billingCycle: 'monthly',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
},
{
  name: 'Kiara Laras',
  email: 'kiara@synchro.com',
  password,
  role: 'project_manager',
  jobTitle: 'Project Manager',
  bio: 'Keeping teams aligned and projects on track.',
  isEmailVerified: true,
  avatar: { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', publicId: '' },
  subscription: {
    plan: 'pro',
    status: 'active',
    billingCycle: 'yearly',
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
},
    {
      name: 'Joe Tesla',
      email: 'joe@synchro.com',
      password,
      role: 'team_member',
      jobTitle: 'Frontend Developer',
      bio: 'React enthusiast. Coffee lover ☕',
      isEmailVerified: true,
      avatar: {
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        publicId: '',
      },
    },
    {
      name: 'Tania Wells',
      email: 'tania@synchro.com',
      password,
      role: 'team_member',
      jobTitle: 'Backend Developer',
      bio: 'Node.js + MongoDB specialist',
      isEmailVerified: true,
      avatar: {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
        publicId: '',
      },
    },
    {
      name: 'Marcus Reed',
      email: 'marcus@synchro.com',
      password,
      role: 'team_member',
      jobTitle: 'UI/UX Designer',
      bio: 'Crafting pixel-perfect experiences.',
      isEmailVerified: true,
      avatar: {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        publicId: '',
      },
    },
  ]);

  console.log(`   ✓ Created ${users.length} users`);
  return users;
};

// ===== TEAMS =====
const seedTeams = async (users) => {
  console.log('🌱 Seeding teams...');
  await Team.deleteMany();

  const [sarah, kiara, joe, tania, marcus] = users;

  const teams = await Team.insertMany([
    {
      name: 'Design Team',
      description: 'Our talented UI/UX designers crafting beautiful interfaces',
      icon: '🎨',
      color: '#ec4899',
      owner: sarah._id,
      members: [
        { user: sarah._id, role: 'admin' },
        { user: marcus._id, role: 'member' },
        { user: kiara._id, role: 'manager' },
      ],
    },
    {
      name: 'Development Squad',
      description: 'Full-stack engineering team',
      icon: '💻',
      color: '#3b82f6',
      owner: kiara._id,
      members: [
        { user: kiara._id, role: 'admin' },
        { user: joe._id, role: 'member' },
        { user: tania._id, role: 'member' },
      ],
    },
  ]);

  // Add teams to users
  await User.findByIdAndUpdate(sarah._id, { $addToSet: { teams: [teams[0]._id] } });
  await User.findByIdAndUpdate(marcus._id, { $addToSet: { teams: [teams[0]._id] } });
  await User.findByIdAndUpdate(kiara._id, { $addToSet: { teams: [teams[0]._id, teams[1]._id] } });
  await User.findByIdAndUpdate(joe._id, { $addToSet: { teams: [teams[1]._id] } });
  await User.findByIdAndUpdate(tania._id, { $addToSet: { teams: [teams[1]._id] } });

  console.log(`   ✓ Created ${teams.length} teams`);
  return teams;
};

// ===== PROJECTS =====
const seedProjects = async (users, teams) => {
  console.log('🌱 Seeding projects...');
  await Project.deleteMany();

  const [sarah, kiara, joe, tania, marcus] = users;

  const projects = await Project.insertMany([
    {
      name: 'ABC Dashboard',
      description: 'Premium analytics dashboard for enterprise clients with realtime metrics, KPI tracking, and beautiful charts.',
      icon: '📊',
      color: '#6366f1',
      status: 'active',
      priority: 'urgent',
      progress: 55,
      startDate: daysFromNow(-30),
      dueDate: daysFromNow(45),
      owner: sarah._id,
      team: teams[0]._id,
      members: [
        { user: sarah._id, role: 'manager' },
        { user: kiara._id, role: 'manager' },
        { user: joe._id, role: 'member' },
        { user: tania._id, role: 'member' },
        { user: marcus._id, role: 'member' },
      ],
      tags: ['dashboard', 'analytics', 'enterprise'],
      labels: [
        { name: 'Frontend', color: '#3b82f6' },
        { name: 'Design', color: '#ec4899' },
      ],
      milestones: [
        { title: 'Design Approval', dueDate: daysFromNow(7), completed: true },
        { title: 'Backend Integration', dueDate: daysFromNow(20), completed: false },
        { title: 'Launch', dueDate: daysFromNow(45), completed: false },
      ],
    },
    {
      name: 'Kiara Website Redesign',
      description: 'Complete redesign of the marketing website with new branding and improved conversion flow.',
      icon: '🌐',
      color: '#ec4899',
      status: 'active',
      priority: 'high',
      progress: 30,
      startDate: daysFromNow(-15),
      dueDate: daysFromNow(60),
      owner: kiara._id,
      members: [
        { user: kiara._id, role: 'manager' },
        { user: marcus._id, role: 'member' },
        { user: joe._id, role: 'member' },
      ],
      tags: ['website', 'redesign', 'marketing'],
    },
    {
      name: 'Sinen Mobile App',
      description: 'iOS and Android mobile app for project management on the go.',
      icon: '📱',
      color: '#10b981',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: daysFromNow(-5),
      dueDate: daysFromNow(90),
      owner: kiara._id,
      members: [
        { user: kiara._id, role: 'manager' },
        { user: tania._id, role: 'member' },
        { user: joe._id, role: 'member' },
      ],
      tags: ['mobile', 'react-native'],
    },
    {
      name: 'Twingkle Website',
      description: 'Marketing website for Twingkle startup. Modern, fast, and beautiful.',
      icon: '✨',
      color: '#f59e0b',
      status: 'active',
      priority: 'medium',
      progress: 70,
      startDate: daysFromNow(-45),
      dueDate: daysFromNow(15),
      owner: sarah._id,
      members: [
        { user: sarah._id, role: 'manager' },
        { user: marcus._id, role: 'member' },
        { user: tania._id, role: 'member' },
      ],
      tags: ['website', 'startup'],
    },
  ]);

  // Update users
  for (const project of projects) {
    for (const m of project.members) {
      await User.findByIdAndUpdate(m.user, { $addToSet: { projects: project._id } });
    }
  }

  console.log(`   ✓ Created ${projects.length} projects`);
  return projects;
};

// ===== TASKS =====
const seedTasks = async (users, projects) => {
  console.log('🌱 Seeding tasks...');
  await Task.deleteMany();

  const [sarah, kiara, joe, tania, marcus] = users;
  const [abcDashboard, kiaraWebsite, sinenApp, twingkle] = projects;

  const tasks = await Task.insertMany([
    // ===== ABC DASHBOARD TASKS =====
    {
      title: 'Create Wireframe',
      description: 'Design low-fidelity wireframes for the main dashboard pages',
      project: abcDashboard._id,
      status: 'todo',
      priority: 'high',
      progress: 0,
      dueDate: daysFromNow(3),
      createdBy: sarah._id,
      assignees: [sarah._id, marcus._id],
      tags: ['design', 'wireframe'],
      position: 0,
      subtasks: [
        { title: 'Sketch initial layout', completed: false, createdBy: sarah._id },
        { title: 'Get feedback from team', completed: false, createdBy: sarah._id },
      ],
    },
    {
      title: 'UI Testing',
      description: 'Test the new UI components across browsers and devices',
      project: abcDashboard._id,
      status: 'in_progress',
      priority: 'medium',
      progress: 25,
      dueDate: daysFromNow(5),
      createdBy: kiara._id,
      assignees: [joe._id, tania._id],
      tags: ['testing', 'qa'],
      position: 0,
    },
    {
      title: 'Update Style Guide',
      description: 'Refresh design tokens, typography scale, and color palette',
      project: abcDashboard._id,
      status: 'in_review',
      priority: 'urgent',
      progress: 55,
      dueDate: daysFromNow(2),
      createdBy: sarah._id,
      assignees: [sarah._id, marcus._id, kiara._id],
      tags: ['design', 'design-system'],
      position: 0,
      subtasks: [
        { title: 'Update color palette', completed: true, createdBy: sarah._id },
        { title: 'Refine typography', completed: true, createdBy: sarah._id },
        { title: 'Document spacing tokens', completed: false, createdBy: sarah._id },
      ],
    },
    {
      title: 'Create Wireframe v2',
      description: 'High-fidelity wireframes based on feedback',
      project: abcDashboard._id,
      status: 'completed',
      priority: 'high',
      progress: 100,
      dueDate: daysFromNow(-2),
      completedAt: daysFromNow(-1),
      createdBy: sarah._id,
      assignees: [sarah._id, marcus._id],
      tags: ['design'],
      position: 0,
    },
    {
      title: 'Setup API Endpoints',
      description: 'Backend REST APIs for dashboard metrics',
      project: abcDashboard._id,
      status: 'in_progress',
      priority: 'high',
      progress: 60,
      dueDate: daysFromNow(7),
      createdBy: kiara._id,
      assignees: [tania._id],
      tags: ['backend', 'api'],
      position: 1,
    },
    {
      title: 'Client Feedback Meeting',
      description: 'Review progress with stakeholders',
      project: abcDashboard._id,
      status: 'todo',
      priority: 'medium',
      progress: 0,
      dueDate: daysFromNow(1),
      createdBy: kiara._id,
      assignees: [kiara._id, sarah._id],
      tags: ['meeting'],
      position: 1,
    },

    // ===== KIARA WEBSITE TASKS =====
    {
      title: 'Hero section design',
      description: 'Design new hero with animated illustrations',
      project: kiaraWebsite._id,
      status: 'in_progress',
      priority: 'high',
      progress: 40,
      dueDate: daysFromNow(6),
      createdBy: kiara._id,
      assignees: [marcus._id],
      tags: ['design'],
      position: 0,
    },
    {
      title: 'Contact form integration',
      description: 'Wire up contact form to send emails',
      project: kiaraWebsite._id,
      status: 'todo',
      priority: 'low',
      progress: 0,
      dueDate: daysFromNow(14),
      createdBy: kiara._id,
      assignees: [joe._id],
      tags: ['frontend'],
      position: 1,
    },
    {
      title: 'SEO Optimization',
      description: 'Meta tags, sitemap, performance tuning',
      project: kiaraWebsite._id,
      status: 'in_review',
      priority: 'medium',
      progress: 80,
      dueDate: daysFromNow(4),
      createdBy: kiara._id,
      assignees: [joe._id],
      tags: ['seo', 'performance'],
      position: 0,
    },
    {
      title: 'Brand Style Guide',
      description: 'Final brand guidelines document',
      project: kiaraWebsite._id,
      status: 'completed',
      priority: 'high',
      progress: 100,
      dueDate: daysFromNow(-5),
      completedAt: daysFromNow(-3),
      createdBy: kiara._id,
      assignees: [marcus._id, sarah._id],
      tags: ['design', 'branding'],
      position: 0,
    },

    // ===== SINEN MOBILE TASKS =====
    {
      title: 'User research interviews',
      description: 'Conduct 10 user interviews for app concept validation',
      project: sinenApp._id,
      status: 'in_progress',
      priority: 'urgent',
      progress: 30,
      dueDate: daysFromNow(8),
      createdBy: kiara._id,
      assignees: [kiara._id, sarah._id],
      tags: ['research'],
      position: 0,
    },
    {
      title: 'Create Hi-Fi Design',
      description: 'High-fidelity designs for all screens',
      project: sinenApp._id,
      status: 'in_review',
      priority: 'high',
      progress: 65,
      dueDate: daysFromNow(10),
      createdBy: sarah._id,
      assignees: [sarah._id, marcus._id],
      tags: ['design'],
      position: 1,
    },
    {
      title: 'Setup React Native project',
      description: 'Initialize project with Expo and config',
      project: sinenApp._id,
      status: 'completed',
      priority: 'medium',
      progress: 100,
      dueDate: daysFromNow(-7),
      completedAt: daysFromNow(-5),
      createdBy: joe._id,
      assignees: [joe._id],
      tags: ['dev'],
      position: 0,
    },

    // ===== TWINGKLE TASKS =====
    {
      title: 'Client Feedback',
      description: 'Review final designs with client',
      project: twingkle._id,
      status: 'todo',
      priority: 'urgent',
      progress: 0,
      dueDate: daysFromNow(2),
      createdBy: sarah._id,
      assignees: [sarah._id, kiara._id],
      tags: ['client'],
      position: 2,
    },
    {
      title: 'Deploy to production',
      description: 'Vercel deployment with custom domain',
      project: twingkle._id,
      status: 'in_progress',
      priority: 'high',
      progress: 75,
      dueDate: daysFromNow(5),
      createdBy: kiara._id,
      assignees: [tania._id, joe._id],
      tags: ['devops'],
      position: 2,
    },
    {
      title: 'Final QA testing',
      description: 'Cross-browser and mobile testing',
      project: twingkle._id,
      status: 'in_review',
      priority: 'high',
      progress: 90,
      dueDate: daysFromNow(3),
      createdBy: kiara._id,
      assignees: [joe._id, tania._id, marcus._id],
      tags: ['qa', 'testing'],
      position: 2,
    },
    {
      title: 'Animations polish',
      description: 'Add smooth micro-interactions',
      project: twingkle._id,
      status: 'completed',
      priority: 'medium',
      progress: 100,
      dueDate: daysFromNow(-2),
      completedAt: daysFromNow(-1),
      createdBy: sarah._id,
      assignees: [marcus._id],
      tags: ['design', 'animation'],
      position: 1,
    },
  ]);

  console.log(`   ✓ Created ${tasks.length} tasks`);
  return tasks;
};

// ===== COMMENTS =====
const seedComments = async (users, tasks) => {
  console.log('🌱 Seeding comments...');
  await Comment.deleteMany();

  const [sarah, kiara, joe, tania, marcus] = users;

  const sampleTasks = tasks.slice(0, 6);
  const comments = [];

  for (const task of sampleTasks) {
    const c1 = await Comment.create({
      content: 'Great progress on this! Let me know if you need anything from my side.',
      author: kiara._id,
      task: task._id,
      project: task.project,
    });
    const c2 = await Comment.create({
      content: 'Pushed latest changes. Could you review when you have time?',
      author: joe._id,
      task: task._id,
      project: task.project,
    });
    const c3 = await Comment.create({
      content: 'Looks fantastic 🔥 minor tweaks coming.',
      author: sarah._id,
      task: task._id,
      project: task.project,
    });

    await Task.findByIdAndUpdate(task._id, {
      $push: { comments: { $each: [c1._id, c2._id, c3._id] } },
    });

    comments.push(c1, c2, c3);
  }

  console.log(`   ✓ Created ${comments.length} comments`);
  return comments;
};

// ===== NOTIFICATIONS =====
const seedNotifications = async (users, tasks, projects) => {
  console.log('🌱 Seeding notifications...');
  await Notification.deleteMany();

  const [sarah, kiara, joe, tania, marcus] = users;

  const notifs = await Notification.insertMany([
    {
      recipient: sarah._id,
      sender: kiara._id,
      type: 'task_assigned',
      title: 'New task assigned',
      message: 'Kiara assigned you to "Update Style Guide"',
      link: `/tasks/${tasks[2]._id}`,
      relatedTask: tasks[2]._id,
      isRead: false,
    },
    {
      recipient: sarah._id,
      sender: joe._id,
      type: 'task_commented',
      title: 'New comment',
      message: 'Joe commented on "Create Wireframe"',
      link: `/tasks/${tasks[0]._id}`,
      relatedTask: tasks[0]._id,
      isRead: false,
    },
    {
      recipient: sarah._id,
      sender: marcus._id,
      type: 'mention',
      title: 'You were mentioned',
      message: 'Marcus mentioned you in a comment',
      link: `/tasks/${tasks[1]._id}`,
      relatedTask: tasks[1]._id,
      isRead: false,
    },
    {
      recipient: sarah._id,
      sender: kiara._id,
      type: 'deadline_reminder',
      title: 'Deadline approaching',
      message: '"Client Feedback Meeting" is due tomorrow',
      link: `/tasks/${tasks[5]._id}`,
      relatedTask: tasks[5]._id,
      isRead: true,
    },
    {
      recipient: sarah._id,
      sender: kiara._id,
      type: 'project_invite',
      title: 'Added to project',
      message: 'Kiara added you to "Sinen Mobile App"',
      link: `/projects/${projects[2]._id}`,
      relatedProject: projects[2]._id,
      isRead: true,
    },
  ]);

  console.log(`   ✓ Created ${notifs.length} notifications`);
};

// ===== ACTIVITIES =====
const seedActivities = async (users, tasks, projects) => {
  console.log('🌱 Seeding activity logs...');
  await ActivityLog.deleteMany();

  const [sarah, kiara, joe] = users;
  const activities = [];

  for (let i = 0; i < Math.min(tasks.length, 10); i++) {
    const t = tasks[i];
    activities.push(
      await ActivityLog.create({
        user: t.createdBy,
        action: 'created_task',
        entityType: 'task',
        entityId: t._id,
        project: t.project,
        description: `Created task "${t.title}"`,
      })
    );
  }

  for (const p of projects) {
    activities.push(
      await ActivityLog.create({
        user: p.owner,
        action: 'created_project',
        entityType: 'project',
        entityId: p._id,
        project: p._id,
        description: `Created project "${p.name}"`,
      })
    );
  }

  console.log(`   ✓ Created ${activities.length} activities`);
};

// ===== MAIN =====
const seedData = async () => {
  try {
    await connectDB();

    console.log('\n🚀 Starting database seed...\n');

    const users = await seedUsers();
    const teams = await seedTeams(users);
    const projects = await seedProjects(users, teams);
    const tasks = await seedTasks(users, projects);
    await seedComments(users, tasks);
    await seedNotifications(users, tasks, projects);
    await seedActivities(users, tasks, projects);

    // Add some favorites
    await User.findByIdAndUpdate(users[0]._id, {
      $addToSet: { favorites: [projects[0]._id, projects[1]._id] },
    });

    console.log('\n✅ Database seeded successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📧 TEST ACCOUNTS (password: 123456)');
    console.log('═══════════════════════════════════════');
    console.log('👑 Admin:           sarah@synchro.com');
    console.log('🎯 Project Manager: kiara@synchro.com');
    console.log('💻 Team Member:     joe@synchro.com');
    console.log('💻 Team Member:     tania@synchro.com');
    console.log('🎨 Team Member:     marcus@synchro.com');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed error:', err);
    process.exit(1);
  }
};

// ===== DESTROY (clean DB) =====
const destroyData = async () => {
  try {
    await connectDB();
    console.log('🗑️  Destroying all data...');
    await Promise.all([
      User.deleteMany(),
      Project.deleteMany(),
      Task.deleteMany(),
      Team.deleteMany(),
      Comment.deleteMany(),
      Notification.deleteMany(),
      ActivityLog.deleteMany(),
      FileUpload.deleteMany(),
    ]);
    console.log('✅ All data destroyed!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌', err);
    process.exit(1);
  }
};

// Run based on argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}