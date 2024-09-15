import Queue from 'bull';
import { analyzeImage } from '@/app/api/process-extracted-data/route';

const imageQueue = new Queue('image-analysis', process.env.REDIS_URL || '');

imageQueue.process(async (job) => {
  const { figure } = job.data;
  return await analyzeImage(figure);
});

export const addImageToQueue = (figure: any) => {
  return imageQueue.add({ figure });
};

export const getCompletedJobs = async () => {
  const completedJobs = await imageQueue.getCompleted();
  return completedJobs.map(job => job.returnvalue);
};