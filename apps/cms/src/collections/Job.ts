import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Job: CollectionConfig = {
  slug: "job",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "duration",
      type: "text",
      required: true,
    },
    {
      name: "scopes",
      type: "array",
      fields: [
        {
          name: "description",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "techstacks",
      type: "array",
      fields: [
        {
          name: "techstack",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
