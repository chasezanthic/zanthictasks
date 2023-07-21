import type { DbSeedFn } from "@wasp/dbSeed/types.js";
import { group } from "console";

const users = [
  { username: "zanthic", password: "zanthic1", isAdmin: true },
  { username: "Darren", password: "zanthic1", isAdmin: true },
  { username: "Chris", password: "zanthic1", isAdmin: false },
  { username: "Kole", password: "zanthic1", isAdmin: false },
  { username: "Radek", password: "zanthic1", isAdmin: false },
  { username: "Holly", password: "zanthic1", isAdmin: false },
  { username: "Chase", password: "zanthic1", isAdmin: false },
];

// const companies = [
//   {
//     Tradesman: [
//       {
//         Denn2: [
//           {
//             description: "Layout Diagrams",
//             status: 1,
//             comments: "https://app.diagrams.net/?src=about",
//           },
//         ],
//       },
//     ],
//   },
//   "Mikado",
//   "Approach",
//   "Mercer Seeds",
//   "P&P",
//   "Pixel Lights",
//   "Flexahopper",
//   "HyperVac",
//   "Ground Breakers",
//   "Isolation Equipment",
//   "Misc",
// ];

interface CompanyData {
  companyName: string;
  subLists: {
    listName: string;
    group?: string;
    tasks: {
      desc: string;
      status: number;
      assignees: string[];
      comments: string;
    }[];
  }[];
}

const companies: CompanyData[] = [
  {
    companyName: "Tradesman",
    subLists: [
      {
        listName: "Denn2",
        tasks: [
          {
            desc: "Layout Diagrams",
            status: 1,
            assignees: [],
            comments: "https://app.diagrams.net/?src=about",
          },
        ],
      },
      {
        listName: "Denn1",
        tasks: [],
      },
      {
        listName: "ECA Assembly",
        tasks: [
          {
            desc: "Schematics/Layout?",
            status: 1,
            assignees: [],
            comments: "",
          },
          {
            desc: "TD to fix / increase size of push down cylinders",
            status: 1,
            assignees: [],
            comments: "",
          },
          {
            desc: "Radek to finalize points",
            status: 0,
            assignees: [],
            comments: "April 7",
          },
        ],
      },
      {
        listName: "Boothems",
        tasks: [
          {
            desc: "Quote / Price out two more punch systems",
            status: 0,
            assignees: ["Kole"],
            comments: "",
          },
          {
            desc: "Design new punch system with inline cylinders",
            status: 0,
            assignees: ["Kole"],
            comments: "April 30",
          },
        ],
      },
      {
        listName: "Hammerlock",
        tasks: [
          {
            desc: "TD may buy new dies to process one part at a time - not three",
            status: 1,
            assignees: [],
            comments: "",
          },
        ],
      },
      {
        listName: "Cleat Machine",
        tasks: [
          {
            desc: "No Known Issues",
            status: 1,
            assignees: [],
            comments: "",
          },
        ],
      },
      {
        listName: "Cu103",
        tasks: [
          {
            desc: "Order Cablie - Make machine back up (Slear)",
            status: 1,
            assignees: [],
            comments: "Cannot get a response from Darren Ziehl",
          },
        ],
      },
      {
        listName: "Snap lock",
        tasks: [
          {
            desc: "We have the laptop - Adam to give the OK",
            status: 0,
            assignees: ["Chris"],
            comments: "April 30",
          },
          {
            desc: "150 hours / 50 hours for second machine",
            status: 0,
            assignees: ["Chris"],
            comments: "April 30",
          },
        ],
      },
      {
        listName: "Elbow Automation",
        group: "Adj Elbow",
        tasks: [
          {
            desc: "Cartesians to be painted this week",
            status: 0,
            assignees: [],
            comments: "April 7",
          },
          {
            desc: "Build electrical boxes",
            status: 0,
            assignees: ["Kole"],
            comments: "April 14",
          },
          {
            desc: "Order cable chain",
            status: 0,
            assignees: ["Darren"],
            comments: "April 30",
          },
          {
            desc: "Assemble 6 cartesian systems",
            status: 0,
            assignees: ["Kole"],
            comments: "April 30",
          },
          {
            desc: "Refine code / add auto homing",
            status: 0,
            assignees: ["Radek", "Chris"],
            comments: "April 30",
          },
        ],
      },
      {
        listName: "Elbow Manipulator",
        group: "Adj Elbow",
        tasks: [
          {
            desc: "Redesign top grippers",
            status: 0,
            assignees: ["Kole"],
            comments: "April 14",
          },
        ],
      },
      {
        listName: "Cartesian 2.0 System",
        group: "Adj Elbow",
        tasks: [
          {
            desc: "New Fingers / Metal Pad",
            status: 0,
            assignees: ["Kole"],
            comments: "April 19",
          },
          {
            desc: "Install stroke limiters",
            status: 0,
            assignees: ["Kole"],
            comments: "April 14",
          },
          {
            desc: "Light curtain mount redesign - Bring closer to Gantry",
            status: 0,
            assignees: ["Kole"],
            comments: "April 19",
          },
          {
            desc: "Mount start button / man start",
            status: 0,
            assignees: ["Chris"],
            comments: "April 30",
          },
        ],
      },
      {
        listName: "Cartesian 2.0 System",
        group: "Adj Elbow",
        tasks: [
          {
            desc: "New Fingers / Metal Pad",
            status: 0,
            assignees: ["Kole"],
            comments: "April 19",
          },
          {
            desc: "Install stroke limiters",
            status: 0,
            assignees: ["Kole"],
            comments: "April 14",
          },
          {
            desc: "Light curtain mount redesign - Bring closer to Gantry",
            status: 0,
            assignees: ["Kole"],
            comments: "April 19",
          },
          {
            desc: "Mount start button / man start",
            status: 0,
            assignees: ["Chris"],
            comments: "April 30",
          },
        ],
      },
      {
        listName: "Shear in Fab Building",
        group: "Adj Elbow",
        tasks: [
          {
            desc: "Check membrane buttons",
            status: 1,
            assignees: ["Chris"],
            comments: "",
          },
          {
            desc: "Check relays for pneumatic stops",
            status: 1,
            assignees: ["Chris"],
            comments: "",
          },
        ],
      },
      {
        listName: "Compressor Room",
        tasks: [
          {
            desc: "Upgrade for new Valves - Early March",
            status: 0,
            assignees: ["Radek"],
            comments: "April 30",
          },
          {
            desc: "IDEC",
            status: 0,
            assignees: ["Radek"],
            comments: "April 30",
          },
        ],
      },
    ],
  },
  {
    companyName: "Mikado",
    subLists: [
      {
        listName: "Hemp Hub",
        tasks: [
          {
            desc: "Horner Program",
            status: 1,
            assignees: [],
            comments: "",
          },
          {
            desc: "VFD Controls",
            status: 1,
            assignees: [],
            comments: "",
          },
          {
            desc: "Get a new transformer",
            status: 1,
            assignees: [],
            comments: "",
          },
        ],
      },
      {
        listName: "Murrays",
        tasks: [
          {
            desc: "Quote",
            status: 1,
            assignees: [],
            comments: "",
          },
          {
            desc: "Spec System",
            status: 1,
            assignees: [],
            comments: "",
          },
          {
            desc: "Get a new transformer",
            status: 1,
            assignees: [],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "Approach",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          { desc: "MultiPump", status: 1, assignees: [], comments: "" },
          {
            desc: "Acid Pumper",
            status: 1,
            assignees: [],
            comments: "Waiting for test feedback",
          },
          { desc: "Chem Unit", status: 1, assignees: [], comments: "On hold" },
          {
            desc: "Blender",
            status: 0,
            assignees: ["Chris"],
            comments: "Approval to start, April 30",
          },
          {
            desc: "Pumpdown",
            status: 0,
            assignees: [],
            comments: "Future project",
          },
        ],
      },
      {
        listName: "eFrac",
        tasks: [
          {
            desc: "HMI - Reworking layout..?",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "Build a test bench",
            status: 0,
            assignees: ["Darren"],
            comments: "",
          },
          {
            desc: "Need an operational cheat sheet/document",
            status: 0,
            assignees: ["Darren"],
            comments: "",
          },
          {
            desc: "Get ready for field deployment...",
            status: 0,
            assignees: ["Darren"],
            comments: "",
          },
          {
            desc: "Add speed limiter to the hydraulics system under low discharge pressure",
            status: 0,
            assignees: [],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "Mercer Seeds",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "Horner Change",
            status: 0,
            assignees: ["Chris"],
            comments: "",
          },
          {
            desc: "Adding bin full relays",
            status: 0,
            assignees: ["Chris"],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "P&P",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "PCBs Are being designed (PWM / PressSens)",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "Code Will be needed (STM32 Micros)",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "New ECU Boards Needed",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "ECU Boards will need ESP32 Progrmaming",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "Kinco Screen",
            status: 0,
            assignees: ["Holly"],
            comments: "",
          },
          {
            desc: "Chris to make a schematic",
            status: 0,
            assignees: ["Chris"],
            comments: "",
          },
          {
            desc: "Layout diagram",
            status: 0,
            assignees: ["Darren", "Holly"],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "Pixel Lights",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "Waiting fro shear mounting parts.",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "Danfoss programming to address CAN timing",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "Spool Mount Design",
            status: 0,
            assignees: [],
            comments: "Waiting for spool specs",
          },
          {
            desc: "Final Programming",
            status: 0,
            assignees: [],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "Flexahopper",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "Kole to move PCB from Prod to Lab unit",
            status: 1,
            assignees: ["Kole"],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "HyperVac",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "John has a number of design changes - Will review soon",
            status: 0,
            assignees: ["Kole"],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "Ground Breakers",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "Order MC050-120",
            status: 1,
            assignees: [],
            comments: "Valve & Radio system has been quoted ",
          },
        ],
      },
    ],
  },
  {
    companyName: "Isolation Equipment",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "Finalize electrical box layout",
            status: 0,
            assignees: ["Kole"],
            comments: "",
          },
          {
            desc: "HMI/controller test bench design",
            status: 0,
            assignees: [],
            comments: "",
          },
          {
            desc: "Chris to look at encoders",
            status: 0,
            assignees: ["Chris"],
            comments: "",
          },
        ],
      },
    ],
  },
  {
    companyName: "In-House",
    subLists: [
      {
        listName: "noproj",
        tasks: [
          {
            desc: "Wordpress site",
            status: 0,
            assignees: ["Holly"],
            comments: "",
          },
          {
            desc: "Zx Runtime",
            status: 0,
            assignees: ["Radek"],
            comments: "",
          },
          {
            desc: "LORA System",
            status: 0,
            assignees: ["Radek"],
            comments: "",
          },
        ],
      },
    ],
  },
];

const seedUsers = async (prismaClient) => {
  // TODO: open issue about whether the seed data can be placed elsewhere (e.g. local static file)
  users.forEach(async (user) => {
    await prismaClient.user.create({
      data: {
        username: user.username,
        password: user.password,
        isAdmin: user.isAdmin,
      },
    });
  });
};

const seedCompanies = async (prismaClient) => {
  for (const company of companies) {
    const _company = await prismaClient.company.create({
      data: { name: company.companyName },
    });

    for (const project of company.subLists) {
      const proj = await prismaClient.project.create({
        data: {
          name: project.listName,
          company: { connect: { id: _company?.id } },
        },
      });

      if (project.group) {
        let pg = await prismaClient.projectGroup.findFirst({
          where: { name: project.group },
        });

        if (!pg) {
          pg = await prismaClient.projectGroup.create({
            data: {
              name: project.group,
              company: {
                connect: { id: proj.companyId ? proj.companyId : undefined },
              },
            },
          });
        }

        await prismaClient.project.update({
          where: { id: proj?.id },
          data: {
            group: { connect: { id: pg?.id } },
          },
        });
      }

      for (const task of project.tasks) {
        const _task = await prismaClient.task.create({
          data: {
            description: task.desc,
            comments: task.comments,
            status: task.status,
            project: { connect: { id: proj?.id } },
          },
        });

        if (task.assignees.length > 0) {
          for (const username of task.assignees) {
            const user = await prismaClient.user.findFirst({
              where: { username: username },
            });

            if (user) {
              await prismaClient.taskAssignment.create({
                data: {
                  taskId: _task.id,
                  userId: user?.id,
                },
              });
            }
          }
        }
      }
    }
  }
};

async function isSeeded(prismaClient) {
  const result =
    await prismaClient.$queryRaw`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public';`;

  const tablesExist = result[0].count > 0;

  let company = undefined;

  if (tablesExist) {
    company = await prismaClient.company.findFirst();
  }

  const isSeeded = tablesExist && !!company;

  return isSeeded;
}

export const seedAll: DbSeedFn = async (prismaClient) => {
  const seeded = await isSeeded(prismaClient);
  if (!seeded) {
    console.log("seeding");
    await seedUsers(prismaClient);
    await seedCompanies(prismaClient);
  }

  console.log("already seeded");
};
