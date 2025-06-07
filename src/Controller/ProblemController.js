import { getJudge0LanguaeId } from "../judge0/lib.js";
import {
  batchSubmitToJudge0,
  pollBatchSubmissionStatus,
} from "../judge0/BatchService.js";
import Problem from "../Model/Problem.js";

export const getAllProblem = (req, res) => {
  // here -1 means that we are sorting the problems in descending order so that the latest created problems will be on the top
  // for 1 it will be ascending order
  Problem.find({})
    .sort({ createdAt: -1 })
    .then((problems) => {
      res.status(200).json({
        message: "All problems fetched successfully",
        problems,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error fetching problems",
        error: error.message,
      });
    });
};

export const createProblem = async (req, res) => {
  if (!req.isAdmin && !req.isProblemSetter) {
    // if user is not admin and problem setter then he is not authorized to create the problem
    return res.status(403).json({
      message: "You are not authorized to create the problem",
    });
  }
  const {
    title,
    description,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
    testCases,
    referenceSolution,
    company,
    difficulties,
  } = req.body;

  if (
    !title ||
    !description ||
    !inputFormat ||
    !outputFormat ||
    !constraints ||
    !sampleInput ||
    !sampleOutput
  ) {
    return res.status(400).json({
      message: "Please provide all the required fields",
    });
  }
  let submissions = { submissions: [] };
  for (const [language, code] of Object.entries(referenceSolution)) {
    const judge0LanguageId = getJudge0LanguaeId(language);
    console.log("Judge0 Language ID:", language, judge0LanguageId);
    if (!judge0LanguageId) {
      return res.status(400).json({
        message: `Invalid language: ${language}`,
      });
    }

    const submission = testCases.map(({ input, output }) => ({
      source_code: code,
      language_id: judge0LanguageId,
      stdin: input,
      expected_output: output,
    }));
    submissions.submissions.push(...submission);

    console.log("Submissions to Judge0:", submissions);
    const submissionResults = await batchSubmitToJudge0(submissions);

    const tokens = submissionResults.map((result) => result.token);

    const submissionStatus = await pollBatchSubmissionStatus(tokens);

    for (const status of submissionStatus) {
      if (status.status !== 3) {
        // 3: Accepted
        return res.status(400).json({
          message: `Reference solution failed for language ${language} with token ${status.token}`,
        });
      }
    }
  }
  await Problem.create({
    title,
    description,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
    testCases,
    company,
    liked: [],
    disLiked: [],
    solved: [],
    createdByUserId: req.user._id,
    difficulties,
    referenceSolution: {
      ...referenceSolution,
    },
  });
  return res.status(201).json({
    message: "Problem created successfully",
    problem: {
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
      testCases,
      company,
      referenceSolution,
    },
  });
};

export const getProblemById = async (req, res) => {
  const problemId = req.params.id;
  if (!problemId) {
    return res.status(400).json({
      message: "Problem ID is required",
    });
  }
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({
      message: "Problem not found",
    });
  }
  return res.status(200).json({
    message: "Problem fetched successfully",
    problem,
  });
};
export const deleteProblemById = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).json({
      message:
        "You are not authorized to delete the problem, only admin can delete the problem",
    });
  }
  const problemId = req.params.id;
  if (!problemId) {
    return res.status(400).json({
      message: "Problem ID is required",
    });
  }
  const problem = await Problem.findByIdAndDelete(problemId);
  if (!problem) {
    return res.status(404).json({
      message: "Problem not found",
    });
  }
  return res.status(200).json({
    message: "Problem deleted successfully",
  });
};

export const updateProblemById = async (req, res) => {
  if (!req.isAdmin && !req.isProblemSetter) {
    // if user is not admin and problem setter then he is not authorized to update the problem
    return res.status(401).json({
      message: "You are not authorized to update the problem",
    });
  }

  const problemId = req.params.id;
  if (!problemId) {
    return res.status(400).json({
      message: "Problem ID is required",
    });
  }
  const {
    title,
    description,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
    testCases,
    referenceSolution,
    company,
    difficulties,
  } = req.body;
  const problem = await Problem.findByIdAndUpdate(
    problemId,
    {
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleInput,
      sampleOutput,
      testCases,
      company,
      difficulties,
      referenceSolution: {
        ...referenceSolution,
      },
    },
    { new: true }
  );
  if (!problem) {
    return res.status(404).json({
      message: "Problem not found",
    });
  }
  return res.status(200).json({
    message: "Problem updated successfully",
  });
};

export const getSolvedProblem = async (req, res) => {
  return res.status(200).json({
    message: "You are able to get the solved problem",
  });
};
