import { NextFunction, Request, Response, Router } from "express";
import { HTTPResponse } from "&/types/http";
import { DocumentAttributes } from "&/models/document";
import { Document } from "&/db";
import { HttpError } from "http-errors-enhanced";

const documentRouter = Router();

type DocumentListResponse = HTTPResponse<{ documents: DocumentAttributes[] }>;
documentRouter.get(
  "/",
  async (
    _req: Request,
    res: Response<DocumentListResponse>,
    next: NextFunction
  ) => {
    try {
      const documents = await Document.findAll({
        attributes: ["id", "name", "content"],
      }).catch(() => {
        throw new HttpError(500, "Failed to fetch documents");
      });
      res.json({
        success: true,
        data: {
          documents: documents.map((d) => d.toJSON()),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

documentRouter.get(
  "/search",
  async (
    req: Request<unknown, unknown, unknown, { query?: string }>,
    res: Response<DocumentListResponse>,
    next: NextFunction
  ) => {
    try {
      const { query } = req.query;

      if (!query) {
        throw new HttpError(400, "Search query is required");
      }

      const documents = await Document.findSimilarDocuments(query, 3).catch(
        () => {
          throw new HttpError(500, "Failed to fetch documents");
        }
      );

      res.json({
        success: true,
        data: {
          documents: documents.map((d) => d.toJSON()),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default documentRouter;
