// File: pages/api/employee/index.ts
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  switch (method) {
    case 'GET': {
      const employees = await prisma.employeedetails_tb.findMany();
      res.status(200).json(employees);
      break;
    }
    case 'POST': {
      const newEmp = await prisma.employeedetails_tb.create({ data: body });
      res.status(201).json(newEmp);
      break;
    }
    case 'PUT': {
      const updatedEmp = await prisma.employeedetails_tb.update({
        where: { id: Number(query.id) },
        data: body,
      });
      res.status(200).json(updatedEmp);
      break;
    }
    case 'DELETE': {
      const deletedEmp = await prisma.employeedetails_tb.delete({
        where: { id: Number(query.id) },
      });
      res.status(200).json(deletedEmp);
      break;
    }
    default:
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}