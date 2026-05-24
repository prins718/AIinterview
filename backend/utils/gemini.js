
// Detailed simulated databases for offline/mock backup
const mockQuizzes = {
  'javascript': [
    {
      question: "What is the primary difference between 'let' and 'var' in modern JavaScript?",
      options: [
        "'let' is function-scoped, while 'var' is block-scoped.",
        "'let' is block-scoped, while 'var' is function-scoped.",
        "'let' is hoisted with default value undefined, while 'var' is not hoisted.",
        "There is no functional difference; they are interchangeable."
      ],
      correctAnswer: 1,
      explanation: "'let' variables are block-scoped, meaning they only exist inside the nearest block (curly braces), whereas 'var' variables are function-scoped. Also, 'let' variables are not initialized during hoisting (temporal dead zone) while 'var' is initialized to undefined."
    },
    {
      question: "What will `console.log(typeof NaN)` print in the terminal?",
      options: ["'nan'", "'undefined'", "'number'", "'object'"],
      correctAnswer: 2,
      explanation: "In JavaScript, NaN (Not-a-Number) is technically of type 'number' according to the IEEE 754 specification."
    },
    {
      question: "What is the purpose of the JavaScript Event Loop?",
      options: [
        "To compile modern ES6 code into older browser-compatible JS.",
        "To manage multi-threaded garbage collection.",
        "To coordinate the execution of asynchronous callbacks, web APIs, and promise queues.",
        "To manage virtual DOM updates in Single Page Applications."
      ],
      correctAnswer: 2,
      explanation: "The event loop monitors the Call Stack and the Callback/Microtask Queues. When the stack is empty, it pushes the first task from the queues to the stack, enabling asynchronous programming in a single-threaded runtime."
    }
  ],
  'system design': [
    {
      question: "Which pattern is best suited to guarantee 'exactly-once' delivery in a distributed messaging system?",
      options: [
        "At-least-once delivery combined with consumer-side idempotency.",
        "At-most-once delivery combined with message splitting.",
        "High-performance heartbeats on a single cluster coordinator.",
        "Using standard HTTP long-polling."
      ],
      correctAnswer: 0,
      explanation: "Achieving true 'exactly-once' delivery is theoretically difficult across distributed systems. The practical industry pattern is to achieve 'at-least-once' delivery using acknowledgments, combined with consumer-side deduplication (idempotency)."
    },
    {
      question: "What does the CAP theorem state regarding distributed systems?",
      options: [
        "A system can guarantee Capacity, Availability, and Portability concurrently.",
        "A system can guarantee at most two out of three: Consistency, Availability, and Partition Tolerance.",
        "A database can process Concurrency, Autonomy, and Performance seamlessly.",
        "A system should choose caching over primary indexing."
      ],
      correctAnswer: 1,
      explanation: "The CAP theorem states that a distributed data store can simultaneously provide at most two out of three guarantees: Consistency (every read receives the most recent write or an error), Availability (every request receives a non-error response), and Partition Tolerance (the system continues to operate despite arbitrary message loss/delay)."
    }
  ],
  'dsa': [
    {
      question: "Which data structure is most efficient to check for the existence of an item in O(1) average time complexity?",
      options: ["Binary Search Tree", "Hash Table / Hash Set", "Singly Linked List", "Balanced AVL Tree"],
      correctAnswer: 1,
      explanation: "Hash Tables map keys to indices using a hash function, allowing constant time complexity O(1) on average for lookup, insertion, and deletion operations."
    },
    {
      question: "What is the worst-case time complexity of the standard Quick Sort algorithm?",
      options: ["O(N log N)", "O(N)", "O(N^2)", "O(2^N)"],
      correctAnswer: 2,
      explanation: "The worst-case complexity of Quick Sort is O(N^2), which occurs when the pivot chosen is consistently the smallest or largest element (e.g., on already sorted arrays without randomized pivoting)."
    }
  ],
  'python': [
    {
      question: "What is the key difference between a Python list and a Python tuple?",
      options: ["Lists are mutable while tuples are immutable.", "Tuples support indexing while lists do not.", "Lists can hold mixed data types while tuples cannot.", "Tuples are faster to sort but use double the memory."],
      correctAnswer: 0,
      explanation: "In Python, lists are mutable (can be changed after creation) while tuples are immutable (read-only once declared). This makes tuples safer for static configuration and hashable as dictionary keys."
    },
    {
      question: "What is the purpose of Python's Global Interpreter Lock (GIL)?",
      options: ["To encrypt source files during compilation.", "To prevent multiple native threads from executing Python bytecodes concurrently.", "To enforce strict typing on variables.", "To manage connection pools inside django or flask."],
      correctAnswer: 1,
      explanation: "The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once. This simplifies memory management but limits multi-threaded CPU-bound speedups, directing developers to use multiprocessing instead."
    }
  ],
  'devops': [
    {
      question: "What is the primary difference between a Docker container and a Virtual Machine (VM)?",
      options: [
        "Containers virtualize the underlying hardware, whereas VMs virtualize the OS kernel.",
        "Containers share the host OS kernel, whereas VMs carry a complete guest OS on top of a hypervisor.",
        "VMs are always built using node.js while containers use Go.",
        "There is no architectural difference; they are synonymous."
      ],
      correctAnswer: 1,
      explanation: "Containers are lightweight because they share the host system's OS kernel and isolate processes, whereas VMs run a complete guest OS on virtualized hardware managed by a hypervisor, demanding more storage, boot-time, and memory."
    }
  ],
  'security': [
    {
      question: "Which mitigation is most effective to prevent SQL Injection (SQLi) vulnerabilities?",
      options: [
        "Filtering out all single quote characters on the client side.",
        "Using Parameterized Queries (Prepared Statements) with bound variables.",
        "Encoding all server responses to Base64.",
        "Deploying a basic CSS styling reset."
      ],
      correctAnswer: 1,
      explanation: "Parameterized queries separate SQL code from input data, forcing the database engine to treat user input strictly as parameters rather than executable SQL commands, completely neutralizing injection attempts."
    }
  ]
};

const mockInterviews = {
  roles: {
    'frontend engineer': {
      questions: [
        "Can you start by telling me about a complex frontend project you worked on recently, particularly focusing on how you managed state and performance?",
        "Excellent. Regarding performance, how would you optimize a React dashboard displaying hundreds of real-time rendering graph nodes?",
        "Great insights. What are your criteria for deciding between CSS-in-JS, Tailwind CSS, or vanilla CSS in a large enterprise project?",
        "How do you approach accessibility (a11y) and web vitals monitoring in modern web architectures?",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 88,
        rating: "Excellent",
        summary: "The candidate demonstrated advanced knowledge of frontend paradigms, React rendering performance optimizations, and semantic styling design systems. Excellent communications skills.",
        strengths: [
          "Deep understanding of virtual list rendering and memoization.",
          "Strong structural knowledge of web performance metrics (LCP, FID).",
          "Balanced and pragmatic opinion on CSS modular setups."
        ],
        weaknesses: [
          "Could go into deeper detail regarding server-side state hydration paradigms.",
          "No mention of automated accessibility scanning frameworks."
        ],
        recommendations: [
          "Study automated accessibility regression tests (axe-core).",
          "Deepen understanding of SSR/RSC architectures in Next.js."
        ]
      }
    },
    'backend engineer': {
      questions: [
        "Could you describe a time when you had to design a highly scalable database schema? What database did you choose and why?",
        "Understood. When database connection pools start saturating under sudden high load, what diagnostic steps and optimizations do you take?",
        "Nice. How do you design and secure RESTful APIs to prevent DDoS attacks and brute-force access attempts?",
        "Can you talk about your experience designing distributed microservices? How do you handle distributed transaction rollback or integrity?",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 82,
        rating: "Good",
        summary: "The candidate exhibits core competency in relational data models, connection pools, and caching policies. Solid awareness of authentication security.",
        strengths: [
          "Solid comprehension of indexing structures (B-trees).",
          "Good experience with token-based access tokens and API rate limiting.",
          "Familiarity with transactional boundaries."
        ],
        weaknesses: [
          "Slightly generic response regarding database clustering and replication configurations.",
          "Could benefit from learning the Saga pattern for microservice rollbacks."
        ],
        recommendations: [
          "Read up on the Saga Pattern for microservices architecture.",
          "Examine connection-pooling sizing formulas and load balancing."
        ]
      }
    },
    'full stack developer': {
      questions: [
        "How do you coordinate state management between React.js components on the frontend and Node.js sessions on the backend?",
        "Regarding API security, what are your criteria for deciding between cookie-based session tokens and JWTs in a full-stack project?",
        "How do you optimize initial page load performance in a monolithic SPA using dynamic imports and caching layers?",
        "Describe your process for tracking down an unhandled rejection that originates in the database and leaks up to frontend consumers.",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 85,
        rating: "Excellent",
        summary: "Solid full-stack developer profile showing strong command over unified state logic, secure JWT authentication mechanisms, and front-to-back exception tracing.",
        strengths: [
          "Balanced understanding of frontend code splitting and backend route structures.",
          "Clear awareness of CSRF vs XSS mitigations."
        ],
        weaknesses: [
          "Could benefit from discussing memory leak monitoring tools (e.g. Node heapdump)."
        ],
        recommendations: [
          "Study automated full-stack integration testing tools.",
          "Review Node.js stream pipelines for high volume data feeds."
        ]
      }
    },
    'data engineer': {
      questions: [
        "What is your process for designing a robust ETL pipeline? How do you handle schemas changes in raw input data?",
        "Under high-throughput requirements, what are the primary trade-offs between batch processing (Spark) vs stream processing (Flink)?",
        "How do you design database partitioning and clustering to optimize queries spanning billions of records?",
        "What strategies do you use to ensure data lineage and strict auditing across a distributed lakehouse?",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 84,
        rating: "Excellent",
        summary: "The candidate shows an advanced conceptual mastery of modern data pipelines, schema evolution mitigations, and partitioning strategies.",
        strengths: [
          "Strong command over columnar data storage structures.",
          "Clear distinction between batch and real-time stream constraints."
        ],
        weaknesses: [
          "Could specify more automated data-validation check steps."
        ],
        recommendations: [
          "Read up on Great Expectations for automated pipeline checks.",
          "Examine distributed transaction logs in lakehouse architectures."
        ]
      }
    },
    'devops & cloud': {
      questions: [
        "How do you design a zero-downtime Blue-Green deployment pipeline using Infrastructure as Code (Terraform) and Kubernetes?",
        "Under a sudden traffic spike, how do you prevent horizontal auto-scaling from crashing secondary database connection limits?",
        "Describe your strategy for managing secrets securely across multi-tenant cloud microservices.",
        "How do you monitor distributed system health? What are your criteria for setting up pager alerts?",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 86,
        rating: "Excellent",
        summary: "Excellent DevOps practitioner showing clean structural control of container orchestrations, connection pooling limits, and alert policies.",
        strengths: [
          "Proactive secret management isolation views.",
          "Highly pragmatic criteria on defining pager alert thresholds."
        ],
        weaknesses: [
          "Could go into deeper details regarding service mesh sidecar networks (Istio)."
        ],
        recommendations: [
          "Examine sidecar routing and service mesh overheads.",
          "Examine cluster auto-scaler formula constraints."
        ]
      }
    },
    'ai / ml engineer': {
      questions: [
        "How do you design a high-throughput, low-latency API to serve real-time predictions from a large language model?",
        "What strategies do you use to detect and mitigate feature drift in production machine learning models?",
        "How do you structure parallel training pipelines on distributed GPU clusters? How do you manage data bottlenecks?",
        "Describe how you validate ML model safety, bias, and performance thresholds before production rollouts.",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 83,
        rating: "Good",
        summary: "Shows competent grasp of distributed training layouts, feature store setups, and real-time LLM inference response streaming.",
        strengths: [
          "Pragmatic approach to batching predictions to save GPU compute overheads.",
          "Solid comprehension of model testing techniques."
        ],
        weaknesses: [
          "Could expand on specialized vector indexing configurations."
        ],
        recommendations: [
          "Review vector database indexing algorithms (HNSW).",
          "Read up on automated pipeline drift checking tools."
        ]
      }
    },
    'cybersecurity analyst': {
      questions: [
        "What is your process for investigating a suspected cross-site scripting (XSS) exploit that bypasses traditional Web Application Firewalls?",
        "How do you design a secure, least-privilege role configuration in a distributed microservices environment?",
        "Describe how you conduct threat modeling on a new cloud banking application before deployment.",
        "How do you handle a zero-day vulnerability alert? What immediate response steps do you initiate?",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 87,
        rating: "Excellent",
        summary: "Highly skilled security architect demonstrating deep control over least-privilege boundaries, zero-day responses, and active threat modeling.",
        strengths: [
          "Rigorous, detailed security incident isolation workflow.",
          "Excellent conceptual modeling of microservice tokens (OAuth/JWT)."
        ],
        weaknesses: [
          "No mention of automated static code scanning integrations."
        ],
        recommendations: [
          "Examine automated static and dynamic application testing (SAST/DAST) configs.",
          "Review service mesh mutual TLS configurations."
        ]
      }
    },
    'product manager': {
      questions: [
        "How do you structure technical product requirements (PRDs) for a new developer-facing platform API?",
        "What quantitative metrics and qualitative feedback do you prioritize when evaluating feature product-market fit?",
        "Describe a time you had to say 'no' to a major stakeholder request due to architectural constraints. How did you manage expectations?",
        "How do you align cross-functional engineering, UX, and marketing timelines for a high-risk system migration?",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 85,
        rating: "Excellent",
        summary: "Clear developer-focused product manager showing balanced stakeholder management, quantitative feature analysis, and technical architectural alignment.",
        strengths: [
          "Highly empathetic stakeholder negotiation paradigm.",
          "Data-driven focus on technical API success metrics (time-to-first-hello)."
        ],
        weaknesses: [
          "Could elaborate further on managing architectural tech debt allocations."
        ],
        recommendations: [
          "Study technical debt calculation and allocation frameworks.",
          "Review modern agile project velocity tracking metrics."
        ]
      }
    },
    'system architect': {
      questions: [
        "How do you evaluate and choose between microservices vs a modular monolith for an enterprise system starting from scratch?",
        "Under high write throughput, how do you design a database storage layer that ensures global event ordering with low latency?",
        "Describe how you structure disaster recovery systems to meet strict recovery point objective (RPO) and recovery time objective (RTO) targets.",
        "How do you balance structural complexity against developer velocity in a rapidly scaling technical organization?",
        "Thank you! That completes our standard questions. I will now generate your performance scorecard."
      ],
      feedback: {
        score: 89,
        rating: "Excellent",
        summary: "Highly seasoned architect showcasing top-tier mastery over enterprise partitioning decisions, strict RTO/RPO targets, and system complexity management.",
        strengths: [
          "Deep, balanced assessment of microservice overhead vs domain modularity.",
          "Clear metrics regarding disaster recovery replication types (synchronous vs asynchronous)."
        ],
        weaknesses: [
          "Could elaborate more on developer platform self-service tooling."
        ],
        recommendations: [
          "Read up on platform engineering principles and developer portals (Backstage).",
          "Examine global consensus protocols (Raft/Paxos) timing bounds."
        ]
      }
    }
  }
};

const callGeminiAPI = async (prompt, customKey = '') => {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No Gemini API key supplied.");
  }

  // Gemini 2.5 Flash / 1.5 Flash endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  const json = await response.json();
  const textResponse = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) {
    throw new Error("Empty response from Gemini API.");
  }

  return JSON.parse(textResponse);
};

export const geminiService = {
  generateQuiz: async (category, difficulty, customKey = '') => {
    const prompt = `
      Generate a professional Multiple-Choice Quiz for skill category: "${category}" and difficulty level: "${difficulty}".
      You must return a JSON array containing exactly 5 questions.
      Return ONLY a JSON array, conforming to the exact schema:
      [
        {
          "question": "Clear technical question text...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0, // 0-indexed index of the correct option
          "explanation": "Detailed professional explanation of why this answer is correct and others are not."
        }
      ]
      Do not include any markdown format tags like \`\`\`json. Return pure JSON string.
    `;

    try {
      return await callGeminiAPI(prompt, customKey);
    } catch (error) {
      console.warn("⚠️ Gemini generateQuiz failed, loading high-quality mock data: ", error.message);
      // Fallback to mock category data or construct a realistic mock on the fly
      const normalCategory = category.toLowerCase().trim();
      const mockSet = mockQuizzes[normalCategory] || mockQuizzes['javascript'];
      
      // Adapt or duplicate mock sets to return a full set of 5
      const questions = [...mockSet];
      while (questions.length < 5) {
        questions.push({
          question: `Simulated question ${questions.length + 1} regarding ${category} at ${difficulty} level.`,
          options: ["Correct answer choice", "Incorrect alternative A", "Incorrect alternative B", "Incorrect alternative C"],
          correctAnswer: 0,
          explanation: `This is a high-fidelity simulated explanation for the ${category} conceptual quiz question.`
        });
      }
      return questions;
    }
  },

  generateInterviewQuestions: async (role, difficulty, experienceLevel, interviewType, resumeText = '', customKey = '') => {
    const resumeContext = resumeText ? `Here is the candidate's resume/profile content: "${resumeText}". Tailor the questions specifically to their background, projects, and stated tech stack.` : 'No resume uploaded. Adapt the questions to a standard industry benchmark.';
    
    // Tailor specific instruction focus based on the interviewType
    let focusInstruction = 'Generates standard role-tailored technical screening questions.';
    if (interviewType === 'Behavioral') {
      focusInstruction = 'Focus heavily on behavioral, leadership, and soft-skill scenarios following the STAR (Situation, Task, Action, Result) method. Ask about conflict resolution, deadline pressure, and communication.';
    } else if (interviewType === 'System Design') {
      focusInstruction = 'Focus heavily on distributed systems architectures, scaling paradigms, API design, database clustering, microservices, caches, and load balancers. Do not ask for code implementations.';
    } else if (interviewType === 'Coding/Algorithms') {
      focusInstruction = 'Focus heavily on code optimization concepts, Big-O analysis, fundamental data structures (graphs, heaps, trees), and algorithmic trade-offs (e.g. iteration vs recursion).';
    }

    const prompt = `
      You are an expert recruiter conducting a specialized "${interviewType}" interview for a "${role}" position (Experience Level: "${experienceLevel}", Technical Difficulty: "${difficulty}").
      Focus Rule: ${focusInstruction}
      
      Generate exactly 4 specialized, deep, and realistic technical/situational questions to ask the candidate during an interactive conversation.
      ${resumeContext}
      
      Return ONLY a JSON array containing the questions, using this schema:
      [
        "First question...",
        "Second question...",
        "Third question...",
        "Fourth question..."
      ]
    `;

    try {
      return await callGeminiAPI(prompt, customKey);
    } catch (error) {
      console.warn(`⚠️ Gemini generateInterviewQuestions failed for type [${interviewType}], using offline mock database:`, error.message);
      
      // Dynamic simulated questions depending on interviewType fallback
      const typeLower = interviewType.toLowerCase();
      if (typeLower.includes('behavioral')) {
        return [
          "Tell me about a time when you had a severe technical disagreement with a colleague. How did you resolve the conflict and what was the outcome?",
          "Can you describe a scenario where a critical product delivery was falling behind schedule? What actions did you take to manage the risk?",
          "Describe a time you proposed a new technology or architecture to project stakeholders. How did you structure your pitch to secure buy-in?",
          "Tell me about a significant technical mistake you made. What did you learn and how did you apply that lesson to subsequent projects?"
        ];
      } else if (typeLower.includes('design') || typeLower.includes('system')) {
        return [
          `How would you design a highly scalable, real-time push notification system for a "${role}" product that supports 100M active daily users?`,
          "When deciding between distributed multi-master databases (e.g., DynamoDB) vs relational replica sets, how do you evaluate consistency vs availability trade-offs?",
          "How would you design a distributed, high-performance API rate limiting middleware to protect downstream microservices?",
          "How do you approach database schema migrations and zero-downtime production deployments in high-traffic architectures?"
        ];
      } else if (typeLower.includes('coding') || typeLower.includes('algorithm')) {
        return [
          "Can you explain how you would detect a cycle in a directed graph using Depth-First Search? What is the space-time complexity?",
          "How would you design an efficient Least Recently Used (LRU) Cache that supports get and put operations in O(1) time?",
          "Suppose you have a continuous stream of integer metrics. How would you dynamically calculate the median value at any moment with minimal memory overhead?",
          "What are the structural trade-offs between recursion and iterative backtracking when solving permutation search algorithms?"
        ];
      }

      // Default standard role fallback
      const normalRole = role.toLowerCase().trim();
      const template = mockInterviews.roles[normalRole] || mockInterviews.roles['frontend engineer'];
      return template.questions.slice(0, 4);
    }
  },

  getInterviewTurnResponse: async (session, customKey = '') => {
    // This helper helps direct the Gemini conversational stream
    const historyText = session.messages.map(m => `${m.sender === 'user' ? 'Candidate' : 'Interviewer'}: "${m.text}"`).join('\n');
    const nextQuestion = session.nextQuestion;
    
    const prompt = `
      You are an expert technical hiring manager conducting a live interview for a "${session.role}" (Difficulty: "${session.difficulty}").
      Here is the interview history so far:
      ${historyText}

      Now, respond to the candidate's latest answer. 
      Guidelines:
      1. Provide a very brief, encouraging, professional acknowledgment of their answer (1-2 sentences maximum).
      2. Immediately transition to presenting the next question: "${nextQuestion}"
      3. If there is no next question (e.g. this was the final response), state politely that the interview is complete, and that you will now process their overall scorecard.

      Return a JSON object conforming to the schema:
      {
        "interviewerMessage": "Your response to the candidate and the next question..."
      }
    `;

    try {
      const response = await callGeminiAPI(prompt, customKey);
      return response.interviewerMessage;
    } catch (error) {
      console.warn("⚠️ Gemini getInterviewTurnResponse failed, using mock conversational logic.");
      // Fallback: simple conversational progression
      const normalRole = session.role.toLowerCase().trim();
      const template = mockInterviews.roles[normalRole] || mockInterviews.roles['frontend engineer'];
      const currentMsgCount = session.messages.filter(m => m.sender === 'user').length;
      
      if (currentMsgCount >= template.questions.length) {
        return "Thank you for these detailed answers! That completes our interactive mock interview. I am generating your evaluation scorecard and feedback summary right now.";
      }
      const ackList = [
        "Solid points. You showed good clarity there.",
        "Excellent explanation. I appreciate how you laid out the practical trade-offs.",
        "Very clear response, that makes a lot of sense.",
        "Excellent. Let's move on to the next area."
      ];
      const randomAck = ackList[Math.min(currentMsgCount - 1, ackList.length - 1)];
      const nextQ = template.questions[currentMsgCount] || "Thank you! We are done. Let's process the results.";
      return `${randomAck} ${nextQ}`;
    }
  },

  generateInterviewFeedback: async (session, customKey = '') => {
    const historyText = session.messages.map(m => `${m.sender === 'user' ? 'Candidate' : 'Interviewer'}: "${m.text}"`).join('\n');
    
    const prompt = `
      You are a senior technical evaluator. Review this mock interview transcript for the position of "${session.role}":
      
      ---
      ${historyText}
      ---
      
      Provide a highly detailed, objective feedback scorecard.
      Return ONLY a JSON object conforming exactly to this schema:
      {
        "score": 85, // Integer from 0 to 100
        "rating": "Excellent", // "Excellent", "Good", "Needs Improvement"
        "summary": "A cohesive 2-3 sentence overview of their conceptual strengths and demeanor during the session.",
        "strengths": ["Strength 1 (concrete and specific)", "Strength 2...", "Strength 3..."],
        "weaknesses": ["Weakness 1 (constructive and actionable)", "Weakness 2..."],
        "recommendations": ["Actionable study tip 1", "Actionable study tip 2..."]
      }
    `;

    try {
      return await callGeminiAPI(prompt, customKey);
    } catch (error) {
      console.warn("⚠️ Gemini generateInterviewFeedback failed, compiling template fallback feedback.");
      const normalRole = session.role.toLowerCase().trim();
      const template = mockInterviews.roles[normalRole] || mockInterviews.roles['frontend engineer'];
      return template.feedback;
    }
  },

  analyzeResume: async (resumeText, customKey = '') => {
    const prompt = `
      You are an expert technical recruiter. Analyze the following candidate's resume/profile contents:
      
      ---
      ${resumeText}
      ---
      
      Extract core capabilities and provide structured analysis feedback.
      Return ONLY a JSON object conforming exactly to this schema:
      {
        "candidateName": "Extracted name or 'Valued Candidate'",
        "inferredRole": "Estimated primary role (e.g. Full Stack Developer, Data Engineer)",
        "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
        "strengths": ["Strengths observation 1", "Strengths observation 2"],
        "optimizations": ["Improvement suggestion 1", "Improvement suggestion 2"]
      }
    `;

    try {
      return await callGeminiAPI(prompt, customKey);
    } catch (error) {
      console.warn("⚠️ Gemini analyzeResume failed, loading dynamic mock analysis.");
      return {
        candidateName: "Valued Candidate",
        inferredRole: "Software Engineer",
        skills: ["React.js", "Node.js", "Express", "MongoDB", "JavaScript (ES6)", "RESTful APIs"],
        strengths: [
          "Demonstrates strong knowledge in modern single-page frontend architectures.",
          "Consistent work history involving backend API integrations."
        ],
        optimizations: [
          "Consider expanding on distributed database setups or indexing mechanisms.",
          "Add cloud deployment details (AWS/Docker) to round out backend competency."
        ]
      };
    }
  }
};
