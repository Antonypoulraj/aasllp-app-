// File: pages/api/leavemanagement/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  switch (method) {
    case 'GET': {
      const leaves = await prisma.leavemanagement_tb.findMany();
      res.status(200).json(leaves);
      break;
    }
    case 'POST': {
      const newLeave = await prisma.leavemanagement_tb.create({ data: body });
      res.status(201).json(newLeave);
      break;
    }
    case 'PUT': {
      const updated = await prisma.leavemanagement_tb.update({
        where: { id: Number(query.id) },
        data: body,
      });
      res.status(200).json(updated);
      break;
    }
    case 'DELETE': {
      const deleted = await prisma.leavemanagement_tb.delete({
        where: { id: Number(query.id) },
      });
      res.status(200).json(deleted);
      break;
    }
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
