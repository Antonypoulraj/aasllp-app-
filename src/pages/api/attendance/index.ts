// File: pages/api/attendance/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  switch (method) {
    case 'GET': {
      const attendance = await prisma.attendancedetails_tb.findMany();
      res.status(200).json(attendance);
      break;
    }
    case 'POST': {
      const newRecord = await prisma.attendancedetails_tb.create({ data: body });
      res.status(201).json(newRecord);
      break;
    }
    case 'PUT': {
      const updated = await prisma.attendancedetails_tb.update({
        where: { id: Number(query.id) },
        data: body,
      });
      res.status(200).json(updated);
      break;
    }
    case 'DELETE': {
      const deleted = await prisma.attendancedetails_tb.delete({
        where: { id: Number(query.id) },
      });
      res.status(200).json(deleted);
      break;
    }
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
