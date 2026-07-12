export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route non trouvée : ${req.originalUrl}` });
};