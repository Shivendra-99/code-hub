export const batchSubmitToJudge0 = async (submissions) => {
    try{

    const response = await fetch('http://localhost:2358/submissions/batch?base64_encoded=false', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( submissions
        )
        
    });
    console.log("Batch submission response:", response.json);
    return response.json();
    }catch (error) {
        console.error("Error submitting batch to Judge0:", error);
        throw error;
    }
  
}

export const pollBatchSubmissionStatus = async (tokens) => {
    const results = [];
    var data = {}
    for (const token of tokens) {
        let status;
        do {
            const response = await fetch(`http://localhost:2358/submissions/${token}?base64_encoded=false`);
            data = await response.json();
            status = data.status.id;
            console.log(`Polling status for token ${token}:`, data);
            if (status === 1 || status === 2) { // 1: In Queue, 2: Processing
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before polling again
            }
        } while (status === 1 || status === 2);
        results.push({ token, status, data: data });
    }
    console.log("Batch submission results:", results);
    return results;
}