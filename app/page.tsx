  export default function Home() {                                                                                                                                   
    return (                                                                                                                                                         
      <main className="min-h-screen bg-gray-50 py-12 px-4">                                                                                                          
        <div className="max-w-3xl mx-auto">                                                                                                                          
                                                                                                                                                                     
          {/* Header */}                                                                                                                                             
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">                                                                                                   
              AI Resume Analyzer                                                                                                                                     
            </h1>                                                                                                                                                    
            <p className="text-gray-500 text-lg">                                                                                                                    
              Paste your resume and a job description to see how well they match.
            </p>                                                                                                                                                     
          </div>  
                                                                                                                                                                     
          {/* Input Form */}                                                                                                                                         
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
                                                                                                                                                                     
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-2">                                                                                       
                Your Resume                                                                                                                                          
              </label>                                                                                                                                               
              <textarea                                                                                                                                              
                rows={10}                                                                                                                                            
                placeholder="Paste your resume here..."                                                                                                              
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />                                                                                                                                                     
            </div>
                                                                                                                                                                     
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description                                                                                                                                      
              </label>
              <textarea                                                                                                                                              
                rows={10}
                placeholder="Paste the job description here..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />                                                                                                                                                     
            </div>
                                                                                                                                                                     
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">                                     
              Analyze Match
            </button>                                                                                                                                                
                  
          </div>                                                                                                                                                     
        </div>
      </main>                                                                                                                                                        
    );            
  }