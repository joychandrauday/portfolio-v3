/**
 * Structured roadmap data model for dynamic fetching.
 * This replaces hardcoded roadmaps in /learn page with a scalable data model.
 */

export type RoadmapDifficulty =
  "beginner" | "intermediate" | "advanced" | "expert";
export type RoadmapLanguage = "en" | "bn";

export interface RoadmapStep {
  slug: string;
  title: string;
  description: string;
  resources: (string | { label: string; url: string })[];
  myNotes?: string;
  titleBn?: string;
  descriptionBn?: string;
  commands?: string[];
  estimatedMinutes?: number;
}

export interface RoadmapPhase {
  slug: string;
  title: string;
  duration: string;
  description: string;
  /** Optional Bengali overrides — fall back to English when absent. */
  titleBn?: string;
  descriptionBn?: string;
  /** Phase-level learning outcomes, shown on the phase page. */
  outcomes?: string[];
  outcomesBn?: string[];
  steps: RoadmapStep[];
}

export interface Roadmap {
  slug: string;
  title: Record<RoadmapLanguage, string>;
  description: Record<RoadmapLanguage, string>;
  estimatedHours: number;
  difficulty: RoadmapDifficulty;
  icon?: string;
  tags: string[];
  phases: RoadmapPhase[];
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapSummary {
  slug: string;
  title: Record<RoadmapLanguage, string>;
  description: Record<RoadmapLanguage, string>;
  estimatedHours: number;
  difficulty: RoadmapDifficulty;
  icon?: string;
  tags: string[];
  totalPhases: number;
  totalSteps: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get localized title/description for a roadmap
 */
export function getRoadmapTitle(
  roadmap: RoadmapSummary,
  language: RoadmapLanguage,
): string {
  return roadmap.title[language] || roadmap.title.en;
}

export function getRoadmapDescription(
  roadmap: RoadmapSummary,
  language: RoadmapLanguage,
): string {
  return roadmap.description[language] || roadmap.description.en;
}

/**
 * Get localized title/description for a phase
 */
export function getPhaseTitle(
  phase: RoadmapPhase,
  language: RoadmapLanguage,
): string {
  return phase.title;
}

export function getPhaseDescription(
  phase: RoadmapPhase,
  language: RoadmapLanguage,
): string {
  return phase.description;
}

/**
 * Convert Roadmap to RoadmapSummary
 */
export function toRoadmapSummary(roadmap: Roadmap): RoadmapSummary {
  return {
    slug: roadmap.slug,
    title: roadmap.title,
    description: roadmap.description,
    estimatedHours: roadmap.estimatedHours,
    difficulty: roadmap.difficulty,
    icon: roadmap.icon,
    tags: roadmap.tags,
    totalPhases: roadmap.phases.length,
    totalSteps: roadmap.phases.reduce((acc, p) => acc + p.steps.length, 0),
    createdAt: roadmap.createdAt,
    updatedAt: roadmap.updatedAt,
  };
}

/**
 * Difficulty label mapping
 */
export const DIFFICULTY_LABELS: Record<
  RoadmapDifficulty,
  Record<RoadmapLanguage, string>
> = {
  beginner: { en: "Beginner", bn: "শুরুবোক্তা" },
  intermediate: { en: "Intermediate", bn: "মধ্যবর্তী" },
  advanced: { en: "Advanced", bn: "উন্নত" },
  expert: { en: "Expert", bn: "বিশেষজ্ঞ" },
};

/**
 * Sample roadmaps data - in production this could come from a CMS or database
 */
export const ROADMAPS: Roadmap[] = [
  {
    slug: "linux-roadmap",
    title: {
      en: "Linux Mastery",
      bn: "লিনাক্স মাস্টারি",
    },
    description: {
      en: "Step by step guide to learning Linux — navigation, file management, systemd, networking, shell scripting, containerization.",
      bn: "লিনাক্স শিখার ধাপে ধাপে গাইড — নেভিগেশন, ফাইল ম্যানেজমেন্ট, সিস্টেমড, নেটওয়ার্কিং, শেল স্ক্রিপ্টিং, কন্টেইনারাইজেশন।",
    },
    estimatedHours: 70,
    difficulty: "intermediate",
    icon: "terminal",
    tags: [
      "linux",
      "devops",
      "system-admin",
      "shell",
      "networking",
      "systemd",
      "docker",
    ],
    phases: [
      {
        slug: "navigation-basics",
        title: "Navigation Basics",
        duration: "4 steps",
        description: "নেভিগেশন বেসিকস",
        steps: [
          {
            slug: "basic-commands",
            title: "Basic Commands",
            description:
              "ফাইলে নেভিগেট ও পরিচালনা করতে cd, ls, pwd ব্যবহার শিখুন",
            myNotes: "ফাইলে নেভিগেট ও পরিচালনা করতে cd, ls, pwd ব্যবহার শিখুন",
            titleBn: "মৌলিক কমান্ড",
            descriptionBn:
              "ফাইলে নেভিগেট ও পরিচালনা করতে cd, ls, pwd ব্যবহার শিখুন",
            commands: ["cd", "ls", "pwd", "mkdir", "rmdir"],
            resources: [
              {
                label: "Linux Journey - Basic Navigation",
                url: "https://linuxjourney.com/lesson/basic-navigation",
              },
              {
                label: "LinuxHint - Linux File System",
                url: "https://linuxhint.com/linux-file-system/",
              },
              {
                label: "DigitalOcean - Basic Linux Navigation",
                url: "https://www.digitalocean.com/community/tutorials/basic-linux-navigation-and-file-management",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "moving-files-directories",
            title: "Moving Files / Directories",
            description:
              "mv এবং cp কমান্ড ব্যবহার করে ফাইল ও ফোল্ডার সরান বা কপি করুন",
            myNotes:
              "mv এবং cp কমান্ড ব্যবহার করে ফাইল ও ফোল্ডার সরান বা কপি করুন",
            titleBn: "ফাইল ও ডিরেক্টরি সরানো",
            descriptionBn:
              "mv এবং cp কমান্ড ব্যবহার করে ফাইল ও ফোল্ডার সরান বা কপি করুন",
            commands: ["mv", "cp", "mv -i", "cp -r"],
            resources: [
              {
                label: "Linux Handbook - Move/Copy Files",
                url: "https://linuxhandbook.com/move-copy-files-linux/",
              },
              {
                label: "GeeksforGeeks - mv Command",
                url: "https://www.geeksforgeeks.org/linux-mv-command/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "creating-deleting-files-dirs",
            title: "Creating & Deleting Files / Dirs",
            description:
              "touch, mkdir, rm এবং rmdir ব্যবহার করে ফাইল ও ডিরেক্টরি তৈরি ও মুছুন",
            myNotes:
              "touch, mkdir, rm এবং rmdir ব্যবহার করে ফাইল ও ডিরেক্টরি তৈরি ও মুছুন",
            titleBn: "ফাইল ও ডিরেক্টরি তৈরি ও মুছা",
            descriptionBn:
              "touch, mkdir, rm এবং rmdir ব্যবহার করে ফাইল ও ডিরেক্টরি তৈরি ও মুছুন",
            commands: ["touch", "mkdir", "rm", "rmdir", "mkdir -p"],
            resources: [
              {
                label: "Linux Handbook - Create Delete Files",
                url: "https://linuxhandbook.com/create-delete-files-linux/",
              },
              {
                label: "Linuxize - rm Command",
                url: "https://linuxize.com/post/how-to-remove-directory-in-linux/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "directory-hierarchy-overview",
            title: "Directory Hierarchy Overview",
            description:
              "লিনাক্স ফাইলসিস্টেম হায়ারার্কি স্ট্যান্ডার্ড (FHS) বুঝুন",
            myNotes:
              "লিনাক্স ফাইলসিস্টেম হায়ারার্কি স্ট্যান্ডার্ড (FHS) বুঝুন",
            titleBn: "ডিরেক্টরি hierarchy",
            descriptionBn:
              "লিনাক্স ফাইলসিস্টেম হায়ারার্কি স্ট্যান্ডার্ড (FHS) বুঝুন",
            commands: ["ls /", "ls /etc", "ls /var", "ls /home", "ls /usr"],
            resources: [
              {
                label: "Linux Handbook - FHS Directory Structure",
                url: "https://linuxhandbook.com/linux-directory-structure/",
              },
              {
                label: "RedHat - Filesystem Hierarchy Standard",
                url: "https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/4/html/reference_guide/s1-filesystem-fhs",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "editing-files",
        title: "Editing Files",
        duration: "1 steps",
        description: "ফাইল সম্পাদনা",
        steps: [
          {
            slug: "nano",
            title: "Nano",
            description:
              "কম্যান্ড-লাইনে ফাইল তৈরি ও সম্পাদনা করতে ন্যানো টেক্সট এডিটর ব্যবহার শিখুন",
            myNotes:
              "কম্যান্ড-লাইনে ফাইল তৈরি ও সম্পাদনা করতে ন্যানো টেক্সট এডিটর ব্যবহার শিখুন",
            titleBn: "ন্যানো এডিটর",
            descriptionBn:
              "কম্যান্ড-লাইনে ফাইল তৈরি ও সম্পাদনা করতে ন্যানো টেক্সট এডিটর ব্যবহার শিখুন",
            commands: [
              "nano",
              "nano filename",
              "Ctrl+O (save)",
              "Ctrl+X (exit)",
            ],
            resources: [
              {
                label: "GNU Nano Official",
                url: "https://www.nano-editor.org/",
              },
              {
                label: "ItsFoss - Nano Editor Guide",
                url: "https://itsfoss.com/nano-editor-guide/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "shell-and-other-basics",
        title: "Shell and Other Basics",
        duration: "5 steps",
        description: "শেল ও অন্যান্য বেসিক",
        steps: [
          {
            slug: "command-path",
            title: "Command Path",
            description:
              "শেল কোথায় এক্সécutable ফাইল খোঁজে সে সম্পর্কে PATH Environment Variable জানুন",
            myNotes:
              "শেল কোথায় এক্সécutable ফাইল খোঁজে সে সম্পর্কে PATH Environment Variable জানুন",
            titleBn: "কম্যান্ড পাথ",
            descriptionBn:
              "শেল কোথায় এক্সécutable ফাইল খোঁজে সে সম্পর্কে PATH Environment Variable জানুন",
            commands: ["echo $PATH", "which ls", "export PATH=$PATH:/new/path"],
            resources: [
              {
                label: "LinuxConfig - PATH Variable",
                url: "https://linuxconfig.org/linux-path-environment-variable",
              },
              {
                label: "CyberCiti - Find Path of Command",
                url: "https://www.cyberciti.biz/howto/finding-a-path-of-a-linux-command-like-a-pro/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "environment-variables",
            title: "Environment Variables",
            description:
              "শেল সেশন ও প্রসেসের আচরণ প্রভাবিত করে এমন ডাইনামিক নামসহ মান সম্পর্কে জানুন",
            myNotes:
              "শেল সেশন ও প্রসেসের আচরণ প্রভাবিত করে এমন ডাইনামিক নামসহ মান সম্পর্কে জানুন",
            titleBn: "এনভায়রনমেন্ট ভেরিয়েবল",
            descriptionBn:
              "শেল সেশন ও প্রসেসের আচরণ প্রভাবিত করে এমন ডাইনামিক নামসহ মান সম্পর্কে জানুন",
            commands: ["env", "export VAR=value", "unset VAR", "printenv"],
            resources: [
              {
                label: "LabEx - Linux Environment Variables",
                url: "https://labex.io/tutorials/linux-environment-variables-in-linux-385274",
              },
              {
                label: "Linuxize - Set List Environment Variables",
                url: "https://linuxize.com/post/how-to-set-and-list-environment-variables-in-linux/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "command-help",
            title: "Command Help",
            description:
              "কম্যান্ডের ডকুমেন্টেশন পেতে man, help, --help এবং tldr ব্যবহার করুন",
            myNotes:
              "কম্যান্ডের ডকুমেন্টেশন পেতে man, help, --help এবং tldr ব্যবহার করুন",
            titleBn: "কম্যান্ড হেল্প",
            descriptionBn:
              "কম্যান্ডের ডকুমেন্টেশন পেতে man, help, --help এবং tldr ব্যবহার করুন",
            commands: ["man ls", "ls --help", "tldr tar", "help cd"],
            resources: [
              {
                label: "TLDR Pages",
                url: "https://github.com/tldr-pages/tldr",
              },
              {
                label: "LinuxHandbook - Help Command",
                url: "https://linuxhandbook.com/help-command/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "redirects",
            title: "Redirects",
            description:
              "কম্যান্ডের ইনপুট আউটপুট যেখানে যাবে সেটি >, >>, <, | অপারেটর দিয়ে নিয়ন্ত্রণ করুন",
            myNotes:
              "কম্যান্ডের ইনপুট আউটপুট যেখানে যাবে সেটি >, >>, <, | অপারেটর দিয়ে নিয়ন্ত্রণ করুন",
            titleBn: "রিডাইরেকশন",
            descriptionBn:
              "কম্যান্ডের ইনপুট আউটপুট যেখানে যাবে সেটি >, >>, <, | অপারেটর দিয়ে নিয়ন্ত্রণ করুন",
            commands: [
              "ls > out.txt",
              "cat < in.txt",
              "cmd1 | cmd2",
              "echo hi >> log.txt",
            ],
            resources: [
              {
                label: "LinuxHandbook - Redirection",
                url: "https://linuxhandbook.com/redirection-linux/",
              },
              {
                label: "GNU Bash Manual - Redirections",
                url: "https://www.gnu.org/software/bash/manual/html_node/Redirections.html",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "super-user",
            title: "Super User",
            description:
              "রুট অ্যাকাউন্টসহ অপরিমিত অ্যাক্সেস এবং অস্থায়ী বিশেষাধিকার পেতে sudo ব্যবহার করুন",
            myNotes:
              "রুট অ্যাকাউন্টসহ অপরিমিত অ্যাক্সেস এবং অস্থায়ী বিশেষাধিকার পেতে sudo ব্যবহার করুন",
            titleBn: "সুপার ইউজার",
            descriptionBn:
              "রুট অ্যাকাউন্টসহ অপরিমিত অ্যাক্সেস এবং অস্থায়ী বিশেষাধিকার পেতে sudo ব্যবহার করুন",
            commands: [
              "sudo apt update",
              "sudo -i",
              "whoami",
              "sudo !!",
              "su -",
            ],
            resources: [
              {
                label: "RedHat - Linux Superuser Access",
                url: "https://www.redhat.com/en/blog/linux-superuser-access/",
              },
              {
                label: "ComputerNetworkingNotes - Root vs Sudo",
                url: "https://www.computernetworkingnotes.com/linux-tutorials/difference-between-the-root-user-and-super-sudo-user.html",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "working-with-files",
        title: "Working with Files",
        duration: "4 steps",
        description: "ফাইল নিয়ে কাজ",
        steps: [
          {
            slug: "file-permissions",
            title: "File Permissions",
            description:
              "মালিক, গ্রুপ ও অন্যদের পঠন-লিখন-পরিচালন অনুমতি (chmod, chown, chgrp) বুঝুন",
            myNotes:
              "মালিক, গ্রুপ ও অন্যদের পঠন-লিখন-পরিচালন অনুমতি (chmod, chown, chgrp) বুঝুন",
            titleBn: "ফাইল পারমিশন",
            descriptionBn:
              "মালিক, গ্রুপ ও অন্যদের পঠন-লিখন-পরিচালন অনুমতি (chmod, chown, chgrp) বুঝুন",
            commands: [
              "ls -l",
              "chmod 755 file",
              "chown user file",
              "chgrp group file",
              "chmod +x script.sh",
            ],
            resources: [
              {
                label: "LinuxHandbook - File Permissions",
                url: "https://linuxhandbook.com/linux-file-permissions/",
              },
              {
                label: "LabEx - Linux Permissions",
                url: "https://labex.io/tutorials/linux-permissions-of-files-270252",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "archiving-and-compressing",
            title: "Archiving and Compressing",
            description: "ব্যাকআপ ও বিতরণের জন্য tar, gzip, zip ব্যবহার করুন",
            myNotes: "ব্যাকআপ ও বিতরণের জন্য tar, gzip, zip ব্যবহার করুন",
            titleBn: "আর্কাইভ ও কমপ্রেশন",
            descriptionBn: "ব্যাকআপ ও বিতরণের জন্য tar, gzip, zip ব্যবহার করুন",
            commands: [
              "tar -czvf archive.tar.gz folder/",
              "tar -xzvf archive.tar.gz",
              "gzip file",
              "zip -r archive.zip folder/",
            ],
            resources: [
              {
                label: "LabEx - Linux File Packaging",
                url: "https://labex.io/tutorials/linux-file-packaging-and-compression-385413",
              },
              {
                label: "PhoenixNAP - tar Command",
                url: "https://phoenixnap.com/kb/linux-tar-command",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "copying-and-renaming",
            title: "Copying and Renaming",
            description:
              "ফাইল ও ডিরেক্টরি কপি ও স্থানান্তর/রিনেম করতে cp এবং mv ব্যবহার করুন",
            myNotes:
              "ফাইল ও ডিরেক্টরি কপি ও স্থানান্তর/রিনেম করতে cp এবং mv ব্যবহার করুন",
            titleBn: "কপি ও রিনেমিং",
            descriptionBn:
              "ফাইল ও ডিরেক্টরি কপি ও স্থানান্তর/রিনেম করতে cp এবং mv ব্যবহার করুন",
            commands: [
              "cp src dest",
              "cp -r dir1 dir2",
              "mv old new",
              "mv file /dest/",
            ],
            resources: [
              {
                label: "Linux.org - mv and cp",
                url: "https://www.linux.org/threads/mv-and-cp.54793/",
              },
              {
                label: "LabEx - cp Command",
                url: "https://labex.io/tutorials/linux-linux-cp-command-file-copying-209744/",
              },
              {
                label: "LabEx - mv Command",
                url: "https://labex.io/tutorials/linux-linux-mv-command-file-moving-and-renaming-209743/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "soft-links-hard-links",
            title: "Soft Links / Hard Links",
            description: "ফাইল মধ্যকর্মে সিম্বলিক ও হার্ড লিঙ্ক তৈরি করুন",
            myNotes: "ফাইল মধ্যকর্মে সিম্বলিক ও হার্ড লিঙ্ক তৈরি করুন",
            titleBn: "সফট ও হার্ড লিঙ্ক",
            descriptionBn: "ফাইল মধ্যকর্মে সিম্বলিক ও হার্ড লিঙ্ক তৈরি করুন",
            commands: [
              "ln -s target link",
              "ln target hardlink",
              "ls -l link",
              "readlink -f link",
            ],
            resources: [
              {
                label: "LinuxHandbook - Symbolic Links",
                url: "https://linuxhandbook.com/symbolic-link-linux/",
              },
              {
                label: "GeeksforGeeks - ln Command",
                url: "https://www.geeksforgeeks.org/ln-command-linux-with-examples/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "text-processing",
        title: "Text Processing",
        duration: "2 steps",
        description: "টেক্সট প্রসেসিং",
        steps: [
          {
            slug: "text-processing-intro",
            title: "Text Processing Intro",
            description:
              "টেক্সট ডেটা ম্যানিপুলেট করতে grep, sed, awk, sort, uniq শিখুন",
            myNotes:
              "টেক্সট ডেটা ম্যানিপুলেট করতে grep, sed, awk, sort, uniq শিখুন",
            titleBn: "টেক্সট প্রসেসিং ভূমিকা",
            descriptionBn:
              "টেক্সট ডেটা ম্যানিপুলেট করতে grep, sed, awk, sort, uniq শিখুন",
            commands: [
              "grep pattern file",
              "sed 's/old/new/' file",
              "awk '{print $1}' file",
              "sort file",
              "uniq -c file",
            ],
            resources: [
              {
                label: "LinuxHandbook - Grep Command",
                url: "https://linuxhandbook.com/grep-command/",
              },
              {
                label: "DigitalOcean - Sed Awk",
                url: "https://www.digitalocean.com/community/tutorials/sed-and-awk-2-simple-tools-for-effective-editing-on-linux",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "grep-sed-awk",
            title: "Grep Sed Awk",
            description:
              "টেক্সট খুঁজে বের করতে grep, পরিবর্তন করতে sed, কলাম প্রসেস করতে awk ব্যবহার করুন",
            myNotes:
              "টেক্সট খুঁজে বের করতে grep, পরিবর্তন করতে sed, কলাম প্রসেস করতে awk ব্যবহার করুন",
            titleBn: "গ্রেপ সেড অক",
            descriptionBn:
              "টেক্সট খুঁজে বের করতে grep, পরিবর্তন করতে sed, কলাম প্রসেস করতে awk ব্যবহার করুন",
            commands: [
              'grep -r "term" /etc/',
              "sed -i 's/foo/bar/g' file",
              "awk -F: '{print $1}' /etc/passwd",
            ],
            resources: [
              {
                label: "ItsFoss - Grep Examples",
                url: "https://itsfoss.com/grep-command-linux/",
              },
              {
                label: "Grymoire - Sed & Awk",
                url: "https://www.grymoire.com/Unix/Sed.html",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "process-management",
        title: "Process Management",
        duration: "1 steps",
        description: "প্রসেস ম্যানেজমেন্ট",
        steps: [
          {
            slug: "background-foreground-processes",
            title: "Background / Foreground Processes",
            description:
              "প্রসেস ব্যাকগ্রাউন্ড বা ফোরগ্রাউন্ডে চালান ও পরিচালনা করুন",
            myNotes:
              "প্রসেস ব্যাকগ্রাউন্ড বা ফোরগ্রাউন্ডে চালান ও পরিচালনা করুন",
            titleBn: "ব্যাকগ্রাউন্ড ফোরগ্রাউন্ড প্রসেস",
            descriptionBn:
              "প্রসেস ব্যাকগ্রাউন্ড বা ফোরগ্রাউন্ডে চালান ও পরিচালনা করুন",
            commands: ["cmd &", "jobs", "fg %1", "bg %1", "Ctrl+Z", "Ctrl+C"],
            resources: [
              {
                label: "LinuxHandbook - Background Foreground",
                url: "https://linuxhandbook.com/run-command-background-linux/",
              },
              {
                label: "DigitalOcean - Process Management",
                url: "https://www.digitalocean.com/community/tutorials/linux-process-management",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "server-review",
        title: "Server Review",
        duration: "1 steps",
        description: "সার্ভার রিভিউ",
        steps: [
          {
            slug: "uptime-and-load",
            title: "Uptime and Load",
            description:
              "কর্মক্ষমতা মনিটরিং ও ক্ষমতা পরিকল্পনার জন্য সিস্টেম আপটাইম ও লোড অ্যাভারেজ পরীক্ষা করুন",
            myNotes:
              "কর্মক্ষমতা মনিটরিং ও ক্ষমতা পরিকল্পনার জন্য সিস্টেম আপটাইম ও লোড অ্যাভারেজ পরীক্ষা করুন",
            titleBn: "আপটাইম ও লোড",
            descriptionBn:
              "কর্মক্ষমতা মনিটরিং ও ক্ষমতা পরিকল্পনার জন্য সিস্টেম আপটাইম ও লোড অ্যাভারেজ পরীক্ষা করুন",
            commands: ["uptime", "w", "top", "htop", "cat /proc/loadavg"],
            resources: [
              {
                label: "TecMint - Uptime Command",
                url: "https://www.tecmint.com/linux-uptime-command-examples/",
              },
              {
                label: "DigitalOcean - Load Average",
                url: "https://www.digitalocean.com/community/tutorials/load-average-in-linux",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "user-management",
        title: "User Management",
        duration: "1 steps",
        description: "ইউজার ম্যানেজমেন্ট",
        steps: [
          {
            slug: "user-management-intro",
            title: "User Management Intro",
            description: "Learn User Management Intro fundamentals.",
            myNotes: "Learn User Management Intro fundamentals.",
            titleBn: "User Management Intro",
            descriptionBn: "লিনাক্স শিখুন।",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "service-management-systemd",
        title: "Service Management (systemd)",
        duration: "4 steps",
        description: "সার্ভিস ম্যানেজমেন্ট (systemd)",
        steps: [
          {
            slug: "creating-new-services",
            title: "Creating New Services",
            description:
              ".service ফাইল /etc/systemd/system/ এ তৈরি করে systemctl দিয়ে নিয়ন্ত্রণ করুন",
            myNotes:
              ".service ফাইল /etc/systemd/system/ এ তৈরি করে systemctl দিয়ে নিয়ন্ত্রণ করুন",
            titleBn: "নতুন সার্ভিস তৈরি",
            descriptionBn:
              ".service ফাইল /etc/systemd/system/ এ তৈরি করে systemctl দিয়ে নিয়ন্ত্রণ করুন",
            commands: [
              "systemctl start service",
              "systemctl enable service",
              "systemctl status service",
              "nano /etc/systemd/system/myservice.service",
            ],
            resources: [
              {
                label: "LinuxHandbook - Create systemd Service",
                url: "https://linuxhandbook.com/create-systemd-services/",
              },
              {
                label: "FossLinux - Linux Services systemd",
                url: "https://www.fosslinux.com/111815/a-guide-to-creating-linux-services-with-systemd.htm",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "checking-service-logs",
            title: "Checking Service Logs",
            description: "নমুনা সার্ভিসের লগ journalctl দিয়ে দেখুন",
            myNotes: "নমুনা সার্ভিসের লগ journalctl দিয়ে দেখুন",
            titleBn: "সার্ভিস লগ যাচাই",
            descriptionBn: "নমুনা সার্ভিসের লগ journalctl দিয়ে দেখুন",
            commands: [
              "journalctl -u service",
              "journalctl -u service -f",
              "journalctl --since today",
              "journalctl -n 50 -u service",
            ],
            resources: [
              {
                label: "UptimeRobot - Journalctl Explained",
                url: "https://uptimerobot.com/knowledge-hub/logging/journalctl-explained-how-to-view-and-analyze-systemd-logs/",
              },
              {
                label: "DigitalOcean - journalctl",
                url: "https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "starting-stopping-services",
            title: "Starting / Stopping Services",
            description: "systemd সার্ভিস শুরু ও বন্ধ করুন",
            myNotes: "systemd সার্ভিস শুরু ও বন্ধ করুন",
            titleBn: "সার্ভিস শুরু ও বন্ধ",
            descriptionBn: "systemd সার্ভিস শুরু ও বন্ধ করুন",
            commands: [
              "systemctl start nginx",
              "systemctl stop nginx",
              "systemctl restart nginx",
              "systemctl reload nginx",
            ],
            resources: [
              {
                label: "LinuxHandbook - systemctl start stop",
                url: "https://linuxhandbook.com/systemctl-start-stop-services/",
              },
              {
                label: "PhoenixNAP - systemctl Commands",
                url: "https://phoenixnap.com/kb/systemctl-commands",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "checking-service-status",
            title: "Checking Service Status",
            description:
              "একটি সার্ভিস সক্রিয়/নিষ্ক্রিয়/বিফল আছে কিনা যাচাই করুন",
            myNotes: "একটি সার্ভিস সক্রিয়/নিষ্ক্রিয়/বিফল আছে কিনা যাচাই করুন",
            titleBn: "সার্ভিস স্ট্যাটাস",
            descriptionBn:
              "একটি সার্ভিস সক্রিয়/নিষ্ক্রিয়/বিফল আছে কিনা যাচাই করুন",
            commands: [
              "systemctl status ssh",
              "systemctl is-active ssh",
              "systemctl is-enabled ssh",
              "systemctl list-units --type=service",
            ],
            resources: [
              {
                label: "Baeldung - Service Status Without Name",
                url: "https://www.baeldung.com/linux/initialization-managers-service-status",
              },
              {
                label: "LinuxConfig - systemctl status",
                url: "https://linuxconfig.org/how-to-use-systemctl-to-manage-systemd-services-and-units",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "package-management",
        title: "Package Management",
        duration: "1 steps",
        description: "প্যাকেজ ম্যানেজমেন্ট",
        steps: [
          {
            slug: "package-management-intro",
            title: "Package Management Intro",
            description: "Learn Package Management Intro fundamentals.",
            myNotes: "Learn Package Management Intro fundamentals.",
            titleBn: "Package Management Intro",
            descriptionBn: "লিনাক্স শিখুন।",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "disks-and-filesystems",
        title: "Disks and Filesystems",
        duration: "1 steps",
        description: "ডিস্ক ও ফাইলসিস্টেম",
        steps: [
          {
            slug: "disks-and-filesystems-intro",
            title: "Disks and Filesystems Intro",
            description: "Learn Disks and Filesystems Intro fundamentals.",
            myNotes: "Learn Disks and Filesystems Intro fundamentals.",
            titleBn: "Disks and Filesystems Intro",
            descriptionBn: "লিনাক্স শিখুন।",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "booting-linux",
        title: "Booting Linux",
        duration: "2 steps",
        description: "লিনাক্স বুটিং",
        steps: [
          {
            slug: "logs",
            title: "Logs",
            description:
              "সিস্টেম স্টার্টআপ সমস্যার সমাধানের জন্য বুট লগ, dmesg, journalctl পরীক্ষা করুন",
            myNotes:
              "সিস্টেম স্টার্টআপ সমস্যার সমাধানের জন্য বুট লগ, dmesg, journalctl পরীক্ষা করুন",
            titleBn: "সিস্টেম লগ",
            descriptionBn:
              "সিস্টেম স্টার্টআপ সমস্যার সমাধানের জন্য বুট লগ, dmesg, journalctl পরীক্ষা করুন",
            commands: [
              "dmesg",
              "journalctl",
              "journalctl -b",
              "less /var/log/syslog",
              "tail -f /var/log/auth.log",
            ],
            resources: [
              {
                label: "LinuxHandbook - journalctl Command",
                url: "https://linuxhandbook.com/journalctl-command/",
              },
              {
                label: "FossLinux - Check System Logs",
                url: "https://www.fosslinux.com/8984/how-to-check-system-logs-on-linux-complete-usage-guide.htm",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "boot-loaders",
            title: "Boot Loaders",
            description:
              "সিস্টেম স্টার্ট হওয়া সময় কার্নেল মেমোরিতে লোড করতে GRUB এবং LILO ব্যবহার করুন",
            myNotes:
              "সিস্টেম স্টার্ট হওয়া সময় কার্নেল মেমোরিতে লোড করতে GRUB এবং LILO ব্যবহার করুন",
            titleBn: "বুট লোডার",
            descriptionBn:
              "সিস্টেম স্টার্ট হওয়া সময় কার্নেল মেমোরিতে লোড করতে GRUB এবং LILO ব্যবহার করুন",
            commands: [
              "sudo update-grub",
              "grub-install",
              "cat /boot/grub/grub.cfg",
              "efibootmgr",
            ],
            resources: [
              {
                label: "GNU GRUB Official",
                url: "https://www.gnu.org/software/grub/",
              },
              {
                label: "ArchWiki - Boot Process",
                url: "https://wiki.archlinux.org/title/Arch_boot_process#Boot_loader",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "networking",
        title: "Networking",
        duration: "7 steps",
        description: "নেটওয়ার্কিং",
        steps: [
          {
            slug: "tcp-ip-stack",
            title: "TCP/IP Stack",
            description: "টিসিপি/আইপি নেটওয়ার্কিং মৌলিক বিষয় বুঝুন",
            myNotes: "টিসিপি/আইপি নেটওয়ার্কিং মৌলিক বিষয় বুঝুন",
            titleBn: "টিসিপি/আইপি স্ট্যাক",
            descriptionBn: "টিসিপি/আইপি নেটওয়ার্কিং মৌলিক বিষয় বুঝুন",
            commands: [
              "ip addr",
              "ip route",
              "ping 8.8.8.8",
              "traceroute google.com",
              "ss -tunlp",
            ],
            resources: [
              {
                label: "LinuxConfig - TCP/IP",
                url: "https://linuxconfig.org/tcp-ip-networking-on-linux",
              },
              {
                label: "DigitalOcean - Networking Fundamentals",
                url: "https://www.digitalocean.com/community/tutorials/an-introduction-to-networking-terminology-interfaces-and-protocols",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "subnetting",
            title: "Subnetting",
            description:
              "কর্মক্ষমতা ও নিরাপত্তা বাড়াতে নেটওয়ার্ককে ছোট সাবনেটে ভাগ করুন",
            myNotes:
              "কর্মক্ষমতা ও নিরাপত্তা বাড়াতে নেটওয়ার্ককে ছোট সাবনেটে ভাগ করুন",
            titleBn: "সাবনেটিং",
            descriptionBn:
              "কর্মক্ষমতা ও নিরাপত্তা বাড়াতে নেটওয়ার্ককে ছোট সাবনেটে ভাগ করুন",
            commands: [
              "ipcalc 192.168.1.0/24",
              "route -n",
              "ip route add",
              "ip route show",
            ],
            resources: [
              {
                label: "Useful.codes - IP Addressing Subnetting",
                url: "https://useful.codes/understanding-ip-addressing-and-subnetting-in-linux/",
              },
              {
                label: "Linux Journal - IP Subnetting Basics",
                url: "https://www.linuxjournal.com/article/6287",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "dns-resolution",
            title: "DNS Resolution",
            description:
              "/etc/resolv.conf, nslookup, ডিগ দিয়ে হোস্টনেমকে আইপিতে রূপান্তর করুন",
            myNotes:
              "/etc/resolv.conf, nslookup, ডিগ দিয়ে হোস্টনেমকে আইপিতে রূপান্তর করুন",
            titleBn: "ডিএনএস রেজল্যুশন",
            descriptionBn:
              "/etc/resolv.conf, nslookup, ডিগ দিয়ে হোস্টনেমকে আইপিতে রূপান্তর করুন",
            commands: [
              "nslookup google.com",
              "dig google.com",
              "cat /etc/resolv.conf",
              "getent hosts google.com",
            ],
            resources: [
              {
                label: "ShellHacks - DNS resolv.conf",
                url: "https://www.shellhacks.com/setup-dns-resolution-resolvconf-example/",
              },
              {
                label: "ArchWiki - Domain Name Resolution",
                url: "https://wiki.archlinux.org/title/Domain_name_resolution",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "file-transfer",
            title: "File Transfer",
            description:
              "নেটওয়ার্কের ওপর ফাইল স্থানান্তরের জন্য scp, rsync, wget ব্যবহার করুন",
            myNotes:
              "নেটওয়ার্কের ওপর ফাইল স্থানান্তরের জন্য scp, rsync, wget ব্যবহার করুন",
            titleBn: "ফাইল ট্রান্সফার",
            descriptionBn:
              "নেটওয়ার্কের ওপর ফাইল স্থানান্তরের জন্য scp, rsync, wget ব্যবহার করুন",
            commands: [
              "scp file user@host:/path/",
              "rsync -av src/ dest/",
              "wget https://example.com/file",
              "sftp user@host",
            ],
            resources: [
              {
                label: "Linuxize - Rsync Command",
                url: "https://linuxize.com/post/how-to-use-rsync-for-local-and-remote-data-transfer-and-synchronization/",
              },
              {
                label: "LinuxHandbook - scp Command",
                url: "https://linuxhandbook.com/scp-command/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "ip-routing",
            title: "IP Routing",
            description:
              "নেটওয়ার্ক মধ্যকর্মে প্যাকেট ফরওয়ার্ড করার জন্য রুটিং টেবিল কনফিগার করুন",
            myNotes:
              "নেটওয়ার্ক মধ্যকর্মে প্যাকেট ফরওয়ার্ড করার জন্য রুটিং টেবিল কনফিগার করুন",
            titleBn: "আইপি রুটিং",
            descriptionBn:
              "নেটওয়ার্ক মধ্যকর্মে প্যাকেট ফরওয়ার্ড করার জন্য রুটিং টেবিল কনফিগার করুন",
            commands: [
              "ip route show",
              "ip route add default via",
              "ip route del",
              "route -n",
            ],
            resources: [
              {
                label: "CyberCiti - IP Route Command",
                url: "https://www.cyberciti.biz/faq/howto-linux-configuring-default-route-with-ipcommand/",
              },
              {
                label: "Linux Journal - IP Addresses Routing",
                url: "https://www.linuxjournal.com/content/linux-networking-simplified-guide-ip-addresses-and-routing",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "ssh",
            title: "SSH",
            description: "নিরাপদ রিমোট অ্যাক্সেস ও কমান্ড এক্সিকিউশন",
            myNotes: "নিরাপদ রিমোট অ্যাক্সেস ও কমান্ড এক্সিকিউশন",
            titleBn: "এসএসএইচ",
            descriptionBn: "নিরাপদ রিমোট অ্যাক্সেস ও কমান্ড এক্সিকিউশন",
            commands: [
              "ssh user@server_ip",
              "ssh-keygen",
              "ssh-copy-id user@host",
              "ssh -p 2222 user@host",
            ],
            resources: [
              {
                label: "Wikipedia - Secure Shell",
                url: "https://en.wikipedia.org/wiki/Secure_Shell",
              },
              {
                label: "Cloudflare - What is SSH",
                url: "https://www.cloudflare.com/learning/access-management/what-is-ssh/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "ethernet-arp-rarp",
            title: "Ethernet & arp/rarp",
            description: "ইথারনেট ব্যবহার করে নেটওয়ার্কিং মৌলিক বিষয় বুঝুন",
            myNotes: "ইথারনেট ব্যবহার করে নেটওয়ার্কিং মৌলিক বিষয় বুঝুন",
            titleBn: "ইথারনেট ও আরপি/আরআরপি",
            descriptionBn: "ইথারনেট ব্যবহার করে নেটওয়ার্কিং মৌলিক বিষয় বুঝুন",
            commands: ["ip link show", "arp -a", "ip neigh", "ethtool eth0"],
            resources: [
              {
                label: "LinuxConfig - ARP Command",
                url: "https://linuxconfig.org/how-to-view-and-manipulate-arp-cache-on-linux",
              },
              {
                label: "TheLinuxCode - Ethernet ARP",
                url: "https://thelinuxcode.com/what-is-arp/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "shell-programming",
        title: "Shell Programming",
        duration: "1 steps",
        description: "শেল প্রোগ্রামিং",
        steps: [
          {
            slug: "debugging",
            title: "Debugging",
            description:
              "bash -x, trap, set, shellcheck দিয়ে শেল স্ক্রিপ্ট ডিবাগ করুন",
            myNotes:
              "bash -x, trap, set, shellcheck দিয়ে শেল স্ক্রিপ্ট ডিবাগ করুন",
            titleBn: "ডিবাগিং",
            descriptionBn:
              "bash -x, trap, set, shellcheck দিয়ে শেল স্ক্রিপ্ট ডিবাগ করুন",
            commands: [
              "bash -x script.sh",
              "set -x",
              "trap 'echo error' ERR",
              "shellcheck script.sh",
            ],
            resources: [
              {
                label: "CyberCiti - Debug Bash Script",
                url: "https://www.cyberciti.biz/tips/debugging-shell-script.html",
              },
              {
                label: "LinuxTechi - Debug Shell Script",
                url: "https://www.linuxtechi.com/debugging-shell-scripts-in-linux/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "troubleshooting",
        title: "Troubleshooting",
        duration: "4 steps",
        description: "ট্রাবলশুটিং",
        steps: [
          {
            slug: "icmp",
            title: "ICMP",
            description:
              "নেটওয়ার্ক ত্রুটি বার্তা ও পৌঁছানোর যাচাই (ping) থেকে নেটওয়ার্ক সমস্যার সমাধান করুন",
            myNotes:
              "নেটওয়ার্ক ত্রুটি বার্তা ও পৌঁছানোর যাচাই (ping) থেকে নেটওয়ার্ক সমস্যার সমাধান করুন",
            titleBn: "আইসিএমপি",
            descriptionBn:
              "নেটওয়ার্ক ত্রুটি বার্তা ও পৌঁছানোর যাচাই (ping) থেকে নেটওয়ার্ক সমস্যার সমাধান করুন",
            commands: [
              "ping google.com",
              "ping -c 4 8.8.8.8",
              "traceroute google.com",
              "mtr google.com",
            ],
            resources: [
              {
                label: "man7.org - icmp(7)",
                url: "https://www.man7.org/linux/man-pages/man7/icmp.7.html",
              },
              {
                label: "HowToUseLinux - ICMP Packets",
                url: "https://www.howtouselinux.com/post/icmp-packets",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "traceroute",
            title: "traceroute",
            description: "প্যাকেট গন্তব্যে পৌঁছানোর পথ দেখুন",
            myNotes: "প্যাকেট গন্তব্যে পৌঁছানোর পথ দেখুন",
            titleBn: "ট্রেসরাউট",
            descriptionBn: "প্যাকেট গন্তব্যে পৌঁছানোর পথ দেখুন",
            commands: [
              "traceroute google.com",
              "mtr google.com",
              "tracepath google.com",
            ],
            resources: [
              {
                label: "LinuxHandbook - traceroute",
                url: "https://linuxhandbook.com/traceroute/",
              },
              {
                label: "HowToGeek - traceroute Command",
                url: "https://www.howtogeek.com/657780/how-to-use-the-traceroute-command-on-linux/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "netstat",
            title: "netstat",
            description: "নেটওয়ার্ক পরিসংখ্যান, খোলা পোর্ট, রুটিং টেবিল",
            myNotes: "নেটওয়ার্ক পরিসংখ্যান, খোলা পোর্ট, রুটিং টেবিল",
            titleBn: "নেটস্ট্যাট",
            descriptionBn: "নেটওয়ার্ক পরিসংখ্যান, খোলা পোর্ট, রুটিং টেবিল",
            commands: [
              "netstat -tunlp",
              "netstat -an",
              "ss -tunlp",
              "netstat -r",
            ],
            resources: [
              {
                label: "LinuxHandbook - netstat Command",
                url: "https://linuxhandbook.com/netstat-command/",
              },
              {
                label: "HowToGeek - netstat",
                url: "https://www.howtogeek.com/513003/how-to-use-netstat-on-linux/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "packet-analysis",
            title: "Packet Analysis",
            description:
              "নেটওয়ার্ক ট্রাফিক ক্যাপচার ও বিশ্লেষণ (tcpdump, Wireshark)",
            myNotes:
              "নেটওয়ার্ক ট্রাফিক ক্যাপচার ও বিশ্লেষণ (tcpdump, Wireshark)",
            titleBn: "প্যাকেট অ্যানালিসিস",
            descriptionBn:
              "নেটওয়ার্ক ট্রাফিক ক্যাপচার ও বিশ্লেষণ (tcpdump, Wireshark)",
            commands: [
              "sudo tcpdump -i eth0",
              "sudo tcpdump -nn -i any port 80",
              "wireshark",
              "tcpdump -r capture.pcap",
            ],
            resources: [
              {
                label: "Debian - tcpdump Guide",
                url: "https://www.debian.org/doc/manuals/apt-guide/index.en.html",
              },
              {
                label: "LinuxLinks - Network Analyzers",
                url: "https://www.linuxlinks.com/best-free-open-source-network-analyzers/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "containerization",
        title: "Containerization",
        duration: "1 steps",
        description: "কন্টেইনারাইজেশন",
        steps: [
          {
            slug: "docker",
            title: "Docker",
            description: "Learn Docker fundamentals.",
            myNotes: "Learn Docker fundamentals.",
            titleBn: "Docker",
            descriptionBn: "লিনাক্স শিখুন।",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
        ],
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-11-02T20:55:47.674Z",
  },
  {
    slug: "docker-roadmap",
    title: {
      en: "Docker Mastery",
      bn: "ডকার মাস্টারি",
    },
    description: {
      en: "Step by step guide to learning Docker — containers, images, Dockerfiles, registries, networking, security and deployment.",
      bn: "ডকার শিখার ধাপে ধাপে গাইড — কন্টেইনা, ইমেজ, ডকারফাইল, রেজিস্ট্রি, নেটওয়ার্কিং, সিকিউরিটি ও ডেপ্লয়মেন্ট।",
    },
    estimatedHours: 60,
    difficulty: "beginner",
    icon: "docker",
    tags: ["docker", "containers", "devops", "containerization"],
    phases: [
      {
        slug: "introduction",
        title: "Introduction",
        duration: "4 steps",
        description: "Introduction — Docker roadmap phase",
        steps: [
          {
            slug: "what-are-containers",
            title: "What are Containers?",
            description: "কন্টেইনার কী এবং সেগুলো কেন ব্যবহার করা হয় বুঝুন",
            myNotes: "কন্টেইনার কী এবং সেগুলো কেন ব্যবহার করা হয় বুঝুন",
            titleBn: "কন্টেইনার কী?",
            descriptionBn: "কন্টেইনার কী এবং সেগুলো কেন ব্যবহার করা হয় বুঝুন",
            commands: ["docker run hello-world", "docker ps"],
            resources: [
              {
                label: "Docker - What is a Container",
                url: "https://docs.docker.com/get-started/",
              },
              {
                label: "RedHat - What are Containers",
                url: "https://www.redhat.com/en/topics/containers/what-are-containers",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "why-do-we-need-containers",
            title: "Why do we need Containers?",
            description: "অ্যাপ্লিকেশন ডিপ্লয়মেন্টে কন্টেইনার সুবিধা বুঝুন",
            myNotes: "অ্যাপ্লিকেশন ডিপ্লয়মেন্টে কন্টেইনার সুবিধা বুঝুন",
            titleBn: "কন্টেইনার কেন প্রয়োজন?",
            descriptionBn: "অ্যাপ্লিকেশন ডিপ্লয়মেন্টে কন্টেইনার সুবিধা বুঝুন",
            commands: [],
            resources: [
              {
                label: "Docker - Why Containers",
                url: "https://www.docker.com/why-docker/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "bare-metal-vs-vms-vs-containers",
            title: "Bare Metal vs VMs vs Containers",
            description:
              "ব্যার মেটাল, ভার্চুয়াল মেশিন ও কন্টেইনারের পার্থক্য বুঝুন",
            myNotes:
              "ব্যার মেটাল, ভার্চুয়াল মেশিন ও কন্টেইনারের পার্থক্য বুঝুন",
            titleBn: "ব্যার মেটাল বনাম ভিএম বনাম কন্টেইনার",
            descriptionBn:
              "ব্যার মেটাল, ভার্চুয়াল মেশিন ও কন্টেইনারের পার্থক্য বুঝুন",
            commands: [],
            resources: [
              {
                label: "IBM - Containers vs VMs",
                url: "https://www.ibm.com/topics/containers-vs-virtual-machines",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "docker-and-oci",
            title: "Docker and OCI",
            description: "ডকার ও ওপেন কন্টেইনার ইনিশিয়েটিভ বুঝুন",
            myNotes: "ডকার ও ওপেন কন্টেইনার ইনিশিয়েটিভ বুঝুন",
            titleBn: "ডকার ও ওসিআই",
            descriptionBn: "ডকার ও ওপেন কন্টেইনার ইনিশিয়েটিভ বুঝুন",
            commands: [],
            resources: [
              {
                label: "OCI Official",
                url: "https://opencontainers.org/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "underlying-technologies",
        title: "Underlying Technologies",
        duration: "2 steps",
        description: "Underlying Technologies — Docker roadmap phase",
        steps: [
          {
            slug: "namespaces",
            title: "Namespaces",
            description: "লিনাক্স নেমস্পেস কন্টেইনার separation বুঝুন",
            myNotes: "লিনাক্স নেমস্পেস কন্টেইনার separation বুঝুন",
            titleBn: "নেমস্পেস",
            descriptionBn: "লিনাক্স নেমস্পেস কন্টেইনার separation বুঝুন",
            commands: ["lsns", "unshare"],
            resources: [
              {
                label: "IBM - Linux Namespaces",
                url: "https://www.ibm.com/topics/linux-namespaces",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "union-filesystems",
            title: "Union Filesystems",
            description: "ইউনিয়ন ফাইলসিস্টেম কন্টেইনার লেয়ার বুঝুন",
            myNotes: "ইউনিয়ন ফাইলসিস্টেম কন্টেইনার লেয়ার বুঝুন",
            titleBn: "ইউনিয়ন ফাইলসিস্টেম",
            descriptionBn: "ইউনিয়ন ফাইলসিস্টেম কন্টেইনার লেয়ার বুঝুন",
            commands: [],
            resources: [
              {
                label: "Docker - Union File System",
                url: "https://docs.docker.com/storage/storagedriver/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "installation-setup",
        title: "Installation / Setup",
        duration: "2 steps",
        description: "Installation / Setup — Docker roadmap phase",
        steps: [
          {
            slug: "docker-desktop-win-mac-linux",
            title: "Docker Desktop (Win/Mac/Linux)",
            description: "Learn Docker Desktop (Win/Mac/Linux) fundamentals.",
            myNotes: "Learn Docker Desktop (Win/Mac/Linux) fundamentals.",
            titleBn: "Docker Desktop (Win/Mac/Linux)",
            descriptionBn: "Learn Docker Desktop (Win/Mac/Linux) fundamentals.",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
          {
            slug: "docker-engine-linux",
            title: "Docker Engine ( Linux )",
            description: "লিনাক্সে ডকার ইঞ্জিন ইন্সটল ও কনফিগার করুন",
            myNotes: "লিনাক্সে ডকার ইঞ্জিন ইন্সটল ও কনফিগার করুন",
            titleBn: "ডকার ইঞ্জিন (লিনাক্স)",
            descriptionBn: "লিনাক্সে ডকার ইঞ্জিন ইন্সটল ও কনফিগার করুন",
            commands: [
              "sudo apt install docker.io",
              "sudo systemctl start docker",
            ],
            resources: [
              {
                label: "Docker Engine Install Linux",
                url: "https://docs.docker.com/engine/install/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "basics-of-docker",
        title: "Basics of Docker",
        duration: "0 steps",
        description: "Basics of Docker — Docker roadmap phase",
        steps: [],
      },
      {
        slug: "using-3rd-party-container-images",
        title: "Using 3rd Party Container Images",
        duration: "0 steps",
        description: "Using 3rd Party Container Images — Docker roadmap phase",
        steps: [],
      },
      {
        slug: "data-persistence",
        title: "Data Persistence",
        duration: "2 steps",
        description: "Data Persistence — Docker roadmap phase",
        steps: [
          {
            slug: "ephemeral-container-filesystem",
            title: "Ephemeral Container Filesystem",
            description: "কন্টেইনার ফাইলসিস্টেম অস্থায়ী কেন বুঝুন",
            myNotes: "কন্টেইনার ফাইলসিস্টেম অস্থায়ী কেন বুঝুন",
            titleBn: "অস্থায়ী কন্টেইনার ফাইলসিস্টেম",
            descriptionBn: "কন্টেইনার ফাইলসিস্টেম অস্থায়ী কেন বুঝুন",
            commands: [],
            resources: [
              {
                label: "Docker - Storage Drivers",
                url: "https://docs.docker.com/storage/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "volume-mounts",
            title: "Volume Mounts",
            description: "ডকার ভলিউম ব্যবহার করে ডেটা পারসিস্ট করুন",
            myNotes: "ডকার ভলিউম ব্যবহার করে ডেটা পারসিস্ট করুন",
            titleBn: "ভলিউম মাউন্ট",
            descriptionBn: "ডকার ভলিউম ব্যবহার করে ডেটা পারসিস্ট করুন",
            commands: ["docker volume create", "docker run -v myvol:/data"],
            resources: [
              {
                label: "Docker - Volumes",
                url: "https://docs.docker.com/storage/volumes/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "container-registries",
        title: "Container Registries",
        duration: "1 steps",
        description: "Container Registries — Docker roadmap phase",
        steps: [
          {
            slug: "dockerhub",
            title: "Dockerhub",
            description: "ডকারহাবে ইমেজ পুশ ও পুল করুন",
            myNotes: "ডকারহাবে ইমেজ পুশ ও পুল করুন",
            titleBn: "ডকারহাব",
            descriptionBn: "ডকারহাবে ইমেজ পুশ ও পুল করুন",
            commands: [
              "docker login",
              "docker push myapp",
              "docker pull nginx",
            ],
            resources: [
              {
                label: "Docker Hub",
                url: "https://hub.docker.com/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "running-containers",
        title: "Running Containers",
        duration: "0 steps",
        description: "Running Containers — Docker roadmap phase",
        steps: [],
      },
      {
        slug: "building-container-images",
        title: "Building Container Images",
        duration: "0 steps",
        description: "Building Container Images — Docker roadmap phase",
        steps: [],
      },
      {
        slug: "docker-cli",
        title: "Docker CLI",
        duration: "2 steps",
        description: "Docker CLI — Docker roadmap phase",
        steps: [
          {
            slug: "containers",
            title: "Containers",
            description: "ডকার কন্টেইনার পরিচালনা করুন",
            myNotes: "ডকার কন্টেইনার পরিচালনা করুন",
            titleBn: "কন্টেইনার",
            descriptionBn: "ডকার কন্টেইনার পরিচালনা করুন",
            commands: [
              "docker ps",
              "docker stop container",
              "docker rm container",
            ],
            resources: [
              {
                label: "Docker - Containers",
                url: "https://docs.docker.com/engine/reference/commandline/container/",
              },
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "networks",
            title: "Networks",
            description: "ডকার নেটওয়ার্ক পরিচালনা করুন",
            myNotes: "ডকার নেটওয়ার্ক পরিচালনা করুন",
            titleBn: "নেটওয়ার্ক",
            descriptionBn: "ডকার নেটওয়ার্ক পরিচালনা করুন",
            commands: ["docker network ls", "docker network create mynet"],
            resources: [
              {
                label: "Docker - Networking",
                url: "https://docs.docker.com/network/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "container-security",
        title: "Container Security",
        duration: "0 steps",
        description: "Container Security — Docker roadmap phase",
        steps: [],
      },
      {
        slug: "networking",
        title: "Networking",
        duration: "0 steps",
        description: "Networking — Docker roadmap phase",
        steps: [],
      },
      {
        slug: "developer-experience",
        title: "Developer Experience",
        duration: "4 steps",
        description: "Developer Experience — Docker roadmap phase",
        steps: [
          {
            slug: "hot-reloading",
            title: "Hot Reloading",
            description: "Learn Hot Reloading fundamentals.",
            myNotes: "Learn Hot Reloading fundamentals.",
            titleBn: "Hot Reloading",
            descriptionBn: "Learn Hot Reloading fundamentals.",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
          {
            slug: "debuggers",
            title: "Debuggers",
            description: "Learn Debuggers fundamentals.",
            myNotes: "Learn Debuggers fundamentals.",
            titleBn: "Debuggers",
            descriptionBn: "Learn Debuggers fundamentals.",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
          {
            slug: "tests",
            title: "Tests",
            description: "Learn Tests fundamentals.",
            myNotes: "Learn Tests fundamentals.",
            titleBn: "Tests",
            descriptionBn: "Learn Tests fundamentals.",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
          {
            slug: "continuous-integration",
            title: "Continuous Integration",
            description: "Learn Continuous Integration fundamentals.",
            myNotes: "Learn Continuous Integration fundamentals.",
            titleBn: "Continuous Integration",
            descriptionBn: "Learn Continuous Integration fundamentals.",
            commands: [],
            resources: [],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "deploying-containers",
        title: "Deploying Containers",
        duration: "1 steps",
        description: "Deploying Containers — Docker roadmap phase",
        steps: [
          {
            slug: "paas-options",
            title: "PaaS Options",
            description: "পiace প্ল্যাটফর্মে কন্টেইনা ডেপ্লয় করুন",
            myNotes: "পiace প্ল্যাটফর্মে কন্টেইনা ডেপ্লয় করুন",
            titleBn: "পiace বিকল্প",
            descriptionBn: "পiace প্ল্যাটফর্মে কন্টেইনা ডেপ্লয় করুন",
            commands: [],
            resources: [
              {
                label: "Docker - PaaS",
                url: "https://docs.docker.com/",
              },
            ],
            estimatedMinutes: 60,
          },
        ],
      },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-11-02T20:55:47.680Z",
  },

  {
    slug: "react-nextjs-roadmap",
    title: {
      en: "React & Next.js Craft",
      bn: "রিএক্ট ও নেক্সট জেএস শিল্প",
    },
    description: {
      en: "Build fast, accessible interfaces without accidental re-renders - from fundamentals to production patterns",
      bn: "দ্রুত, অ্যাক্সেসিবল ইন্টারফেস তৈরি করুন অনিচ্ছাকৃত রি-রেন্ডারের ছাড়া - মৌলিক থেকে প্রোডাকশন প্যাটার্ন পর্যন্ত",
    },
    estimatedHours: 150,
    difficulty: "intermediate",
    icon: "code",
    tags: ["react", "nextjs", "frontend", "typescript", "performance"],
    phases: [
      {
        slug: "fundamentals",
        title: "React Fundamentals",
        duration: "2-3 weeks",
        description:
          "Rendering model, state, effects, and component composition",
        steps: [
          {
            slug: "rendering-model",
            title: "Rendering Model & Reconciliation",
            description:
              "How React renders, virtual DOM, and fiber architecture",
            resources: [
              "https://react.dev/learn/rendering-lists",
              "https://github.com/acdlite/react-fiber-architecture",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "state-management",
            title: "State: Local, Lifted, Derived",
            description: "useState, useReducer, and when to lift state",
            resources: [
              "https://react.dev/learn/state-a-components-memory",
              "https://kentcdodds.com/blog/how-to-optimize-context-with-usememo-and-usecallback",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "effects",
            title: "Effects: When Not to Use useEffect",
            description:
              "Synchronization, data fetching, and effect alternatives",
            resources: [
              "https://react.dev/learn/synchronizing-with-effects",
              "https://www.robinwieruch.de/react-useeffect-explanation/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "performance",
        title: "Performance & Optimization",
        duration: "2-3 weeks",
        description: "Memoization, profiling, and Core Web Vitals",
        steps: [
          {
            slug: "memoization",
            title: "Memoization & Render Profiling",
            description:
              "React.memo, useMemo, useCallback, and React DevTools Profiler",
            resources: [
              "https://react.dev/learn/optimizing-performance",
              "https://kentcdodds.com/blog/usememo-and-usecallback",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "core-web-vitals",
            title: "Core Web Vitals Budget",
            description: "LCP, FID, CLS optimization for React apps",
            resources: [
              "https://web.dev/vitals/",
              "https://calibreapp.com/blog/core-web-vitals",
            ],
            estimatedMinutes: 60,
          },
        ],
      },
      {
        slug: "nextjs",
        title: "Next.js App Router",
        duration: "3-4 weeks",
        description: "Server components, streaming, data fetching, and caching",
        steps: [
          {
            slug: "server-components",
            title: "Server vs Client Components",
            description:
              "When to use each, boundaries, and composition patterns",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
              "https://nextjs.org/docs/app/building-your-application/rendering/client-components",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "data-fetching",
            title: "Data Fetching, Caching & Streaming",
            description:
              "fetch, unstable_cache, Suspense, and streaming responses",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/data-fetching",
              "https://nextjs.org/docs/app/building-your-application/rendering/streaming",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "routing",
            title: "Routing, Layouts & Loading States",
            description:
              "File-system routing, parallel routes, intercepting routes",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/routing",
              "https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "production",
        title: "Production Patterns",
        duration: "2-3 weeks",
        description: "Auth, internationalization, testing, and deployment",
        steps: [
          {
            slug: "accessibility",
            title: "Accessibility & Keyboard Flows",
            description: "ARIA, semantic HTML, focus management, and testing",
            resources: [
              "https://www.w3.org/WAI/ARIA/apg/",
              "https://testing-library.com/docs/react-testing-library/intro/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "deployment",
            title: "Ship a Feature End-to-End",
            description: "CI/CD, preview deployments, and monitoring",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/deploying",
              "https://vercel.com/docs/concepts/deployments/overview",
            ],
            estimatedMinutes: 120,
          },
        ],
      },
    ],
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    slug: "system-design-roadmap",
    title: {
      en: "System Design & Scale",
      bn: "সিস্টেম ডিজাইন ও স্কেল",
    },
    description: {
      en: "Design production systems end-to-end and defend the trade-offs - from requirements to observability",
      bn: "প্রোডাকশন সিস্টেম এন্ড-টু-এন্ড ডিজাইন করুন এবং ট্রেড-অফস রক্ষা করুন - প্রয়োজনীয়তা থেকে পর্যবেক্ষণযোগ্যতা পর্যন্ত",
    },
    estimatedHours: 180,
    difficulty: "advanced",
    icon: "database",
    tags: [
      "system-design",
      "architecture",
      "scalability",
      "distributed-systems",
      "databases",
    ],
    phases: [
      {
        slug: "requirements",
        title: "Requirements & Capacity Planning",
        duration: "1-2 weeks",
        description:
          "Functional/non-functional requirements, SLOs, capacity math",
        steps: [
          {
            slug: "requirements-slos",
            title: "Requirements, SLOs & Capacity Math",
            description: "Gather requirements, define SLOs, calculate capacity",
            resources: [
              "https://sre.google/sre-book/service-level-objectives/",
              "https://github.com/donnemartin/system-design-primer",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "data-layer",
        title: "Data Layer Design",
        duration: "3-4 weeks",
        description:
          "SQL vs NoSQL, indexing, sharding, replication, consistency",
        steps: [
          {
            slug: "sql-nosql",
            title: "SQL vs NoSQL: Access-Pattern Driven Choice",
            description: "Choose the right database for your access patterns",
            resources: [
              "https://www.cockroachlabs.com/blog/sql-vs-nosql/",
              "https://aws.amazon.com/nosql/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "indexing",
            title: "Indexing, Sharding & Partitioning",
            description:
              "B-tree, composite, partial indexes; horizontal scaling strategies",
            resources: [
              "https://use-the-index-luke.com/",
              "https://www.citusdata.com/blog/2016/10/12/sharding-postgres/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "replication",
            title: "Replication & Consistency Models",
            description:
              "Leader-follower, multi-leader, consensus (Raft/Paxos)",
            resources: [
              "https://martin.kleppmann.com/2015/05/11/replication.html",
              "https://raft.github.io/",
            ],
            estimatedMinutes: 120,
          },
        ],
      },
      {
        slug: "messaging",
        title: "Messaging & Resilience",
        duration: "2-3 weeks",
        description:
          "Queues, backpressure, idempotency, rate limiting, circuit breakers",
        steps: [
          {
            slug: "queues",
            title: "Queues, Backpressure & Idempotency",
            description:
              "Message queues, consumer patterns, exactly-once semantics",
            resources: [
              "https://www.rabbitmq.com/tutorials.html",
              "https://kafka.apache.org/documentation/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "resilience",
            title: "Rate Limiting & Circuit Breakers",
            description:
              "Token bucket, leaky bucket, Hystrix/Resilience4j patterns",
            resources: [
              "https://martinfowler.com/bliki/CircuitBreaker.html",
              "https://github.com/resilience4j/resilience4j",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "observability",
        title: "Observability",
        duration: "2-3 weeks",
        description: "Logs, metrics, traces, and debugging production systems",
        steps: [
          {
            slug: "observability",
            title: "Observability: Logs, Metrics, Traces",
            description:
              "Structured logging, Prometheus, OpenTelemetry, distributed tracing",
            resources: [
              "https://opentelemetry.io/docs/",
              "https://prometheus.io/docs/introduction/overview/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "case-studies",
        title: "Case Studies & Mock Interviews",
        duration: "2-3 weeks",
        description: "Design real systems: feed, chat, payments, URL shortener",
        steps: [
          {
            slug: "case-study",
            title: "Case Study: Feed / Chat / Payments",
            description: "End-to-end design of complex systems",
            resources: [
              "https://github.com/donnemartin/system-design-primer",
              "https://www.hellointerview.com/learn/system-design",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "mock-interview",
            title: "Mock Design Interview + Written Review",
            description: "Practice with feedback loop",
            resources: [
              "https://www.systemdesigninterview.com/",
              "https://bytebytego.com/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
    ],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    slug: "dsa-roadmap",
    title: {
      en: "Data Structures & Algorithms",
      bn: "ডেটা স্ট্রাকচার ও অ্যালগরিদম",
    },
    description: {
      en: "Solve medium-level problems fluently and pass a technical interview loop",
      bn: "মিডিয়াম-লেভেল সমস্যা সমাধান করুন সহজে এবং টেকনিক্যাল ইন্টারভিউ লুপ পার করুন",
    },
    estimatedHours: 200,
    difficulty: "intermediate",
    icon: "git-branch",
    tags: ["dsa", "algorithms", "interview-prep", "leetcode", "neetcode"],
    phases: [
      {
        slug: "arrays-strings",
        title: "Arrays, Strings & Two Pointers",
        duration: "1-2 weeks",
        description:
          "Array manipulation, sliding window, two-pointer techniques",
        steps: [
          {
            slug: "arrays-strings",
            title: "Arrays, Strings & Two Pointers",
            description:
              "Array manipulation, sliding window, two-pointer techniques",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/two-pointers/",
            ],
            estimatedMinutes: 90,
          },
          {
            slug: "hashing",
            title: "Hashing & Frequency Maps",
            description: "Hash maps, sets, frequency counting",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/hash-table/",
            ],
            estimatedMinutes: 60,
          },
          {
            slug: "sliding-window",
            title: "Sliding Window Patterns",
            description:
              "Fixed/variable window, character counts, subarray sums",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/sliding-window/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "stacks-queues",
        title: "Stacks, Queues & Monotonic Stack",
        duration: "1-2 weeks",
        description:
          "Stack/queue fundamentals, monotonic stack, next greater element",
        steps: [
          {
            slug: "stack-basics",
            title: "Stack & Monotonic Stack",
            description:
              "LIFO operations, monotonic patterns, histogram problems",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/stack/",
            ],
            estimatedMinutes: 90,
          },
        ],
      },
      {
        slug: "trees-graphs",
        title: "Trees & Graphs",
        duration: "3-4 weeks",
        description: "BFS/DFS, topological sort, union-find, shortest paths",
        steps: [
          {
            slug: "tree-traversals",
            title: "Trees: Traversals, BFS/DFS",
            description:
              "Pre/in/post-order, level-order, recursive & iterative",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/breadth-first-search/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "graph-algorithms",
            title: "Graphs: BFS/DFS + Topological Sort",
            description:
              "Adjacency list/matrix, cycle detection, topological ordering",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/depth-first-search/",
            ],
            estimatedMinutes: 150,
          },
        ],
      },
      {
        slug: "dynamic-programming",
        title: "Dynamic Programming",
        duration: "3-4 weeks",
        description: "1D/2D DP, subsequences, grid problems, optimization",
        steps: [
          {
            slug: "dp-1d",
            title: "DP I: 1D States & Transitions",
            description:
              "Fibonacci, climbing stairs, house robber, coin change",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/dynamic-programming/",
            ],
            estimatedMinutes: 120,
          },
          {
            slug: "dp-2d",
            title: "DP II: 2D Grids & Subsequences",
            description: "LCS, edit distance, matrix path, knapsack variants",
            resources: [
              "https://neetcode.io/roadmap",
              "https://leetcode.com/tag/dynamic-programming/",
            ],
            estimatedMinutes: 150,
          },
        ],
      },
      {
        slug: "interview-prep",
        title: "Interview Preparation",
        duration: "2-3 weeks",
        description: "Mock interviews, timed sets, system design basics",
        steps: [
          {
            slug: "mock-interview",
            title: "Timed Mock Interview Set",
            description: "Full interview simulation with time constraints",
            resources: [
              "https://neetcode.io/roadmap",
              "https://www.techinterviewhandbook.org/",
            ],
            estimatedMinutes: 120,
          },
        ],
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
];

/**
 * Get all roadmaps as summaries
 */
export function getAllRoadmaps(): RoadmapSummary[] {
  return ROADMAPS.map(toRoadmapSummary);
}

/**
 * Get a roadmap by slug
 */
export function getRoadmapBySlug(slug: string): Roadmap | undefined {
  return ROADMAPS.find((r) => r.slug === slug);
}

/**
 * Get roadmap summary by slug
 */
export function getRoadmapSummaryBySlug(
  slug: string,
): RoadmapSummary | undefined {
  const roadmap = getRoadmapBySlug(slug);
  return roadmap ? toRoadmapSummary(roadmap) : undefined;
}

/**
 * Get phases for a roadmap
 */
export function getRoadmapPhases(slug: string): RoadmapPhase[] {
  const roadmap = getRoadmapBySlug(slug);
  return roadmap?.phases ?? [];
}

/**
 * Get a specific phase
 */
export function getPhaseBySlug(
  roadmapSlug: string,
  phaseSlug: string,
): RoadmapPhase | undefined {
  const roadmap = getRoadmapBySlug(roadmapSlug);
  return roadmap?.phases.find((p) => p.slug === phaseSlug);
}

/**
 * Get a specific step
 */
export function getStepBySlug(
  roadmapSlug: string,
  phaseSlug: string,
  stepSlug: string,
): RoadmapStep | undefined {
  const phase = getPhaseBySlug(roadmapSlug, phaseSlug);
  return phase?.steps.find((s) => s.slug === stepSlug);
}

/**
 * Convert roadmap to Learning Track template format
 */
export function roadmapToLearnTemplate(roadmap: Roadmap): {
  key: string;
  label: string;
  title: string;
  domain: string;
  level: "beginner" | "intermediate" | "advanced";
  color: string;
  goal: string;
  weeklyGoalMinutes: number;
  modules: { title: string; estimateMinutes: number; resourceUrl?: string }[];
} {
  const modules = roadmap.phases.flatMap((phase) =>
    phase.steps.map((step) => ({
      title: `${phase.title}: ${step.title}`,
      estimateMinutes: step.estimatedMinutes ?? 60,
      resourceUrl: typeof step.resources[0] === "string" ? step.resources[0] : step.resources[0]?.url ?? null,
    })),
  );

  const difficultyMap: Record<
    string,
    "beginner" | "intermediate" | "advanced"
  > = {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
    expert: "advanced",
  };

  const colorMap: Record<string, string> = {
    "linux-roadmap": "#22c55e",
    "docker-roadmap": "#2496ed",
    "react-nextjs-roadmap": "#06b6d4",
    "system-design-roadmap": "#a855f7",
    "dsa-roadmap": "#f59e0b",
  };

  return {
    key: roadmap.slug,
    label: roadmap.slug.replace(/-/g, " ").toUpperCase(),
    title: roadmap.title.en,
    domain: roadmap.tags[0]?.toUpperCase() || "GENERAL",
    level: difficultyMap[roadmap.difficulty] || "intermediate",
    color: colorMap[roadmap.slug] || "#f59e0b",
    goal: roadmap.description.en,
    weeklyGoalMinutes: 300,
    modules,
  };
}
