import React, { useState, useEffect } from 'react';
import { SentimentAnalysis } from '../types/sentiment';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid} from 'recharts';
import { showErrorWithDetails } from '../utils/toast';
import ErrorBoundary from './ErrorBoundary';

interface SentimentDashboardProps {
  analysis: SentimentAnalysis;
  proposalTitle: string;
}

const COLORS = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#94a3b8'
};

// Error fallback component specific to the sentiment dashboard
const SentimentDashboardErrorFallback = () => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-6 text-red-600">Error Loading Sentiment Dashboard</h2>
    <p className="text-gray-700 mb-4">
      There was a problem displaying the sentiment analysis data. This could be due to:
    </p>
    <ul className="list-disc pl-5 mb-6 text-gray-700">
      <li>Invalid or corrupted sentiment data</li>
      <li>Network issues when fetching data</li>
      <li>Server-side processing errors</li>
    </ul>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Try Again
    </button>
  </div>
);

export const SentimentDashboard: React.FC<SentimentDashboardProps> = ({ analysis }) => {
  const [pieData, setPieData] = useState<Array<{name: string, value: number}>>([]);
  const [barData, setBarData] = useState<Array<{author: string, sentiment: string, value: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Validate the analysis data
      if (!analysis || !analysis.breakdown) {
        throw new Error('Invalid sentiment analysis data');
      }

      // Process pie chart data
      setPieData([
        { name: 'Positive', value: analysis.breakdown.positive },
        { name: 'Negative', value: analysis.breakdown.negative },
        { name: 'Neutral', value: analysis.breakdown.neutral }
      ]);

      // Process bar chart data
      if (analysis.comments && Array.isArray(analysis.comments)) {
        setBarData(analysis.comments.slice(0, 10).reverse().map(comment => ({
          author: comment.author,
          sentiment: comment.sentiment,
          value: 1
        })));
      } else {
        setBarData([]);
      }

      setIsLoading(false);
    } catch (err) {
      setError(showErrorWithDetails(err, 'Sentiment Dashboard'));
      setIsLoading(false);
    }
  }, [analysis]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="h-64 bg-gray-100 rounded-lg"></div>
          <div className="h-64 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-6 bg-gray-100 rounded-full w-20"></div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return <SentimentDashboardErrorFallback />;
  }

  const sentimentEmoji = analysis.overallSentiment === 'positive' ? '😊' :
                        analysis.overallSentiment === 'negative' ? '😞' : '😐';

  return (
    <ErrorBoundary fallback={<SentimentDashboardErrorFallback />}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Sentiment Analysis</h2>
        
        {/* Overall Sentiment */}
        <div className="mb-8 text-center">
          <h3 className="text-xl mb-2">Overall Sentiment</h3>
          <div className="flex items-center justify-center gap-4">
            <span className="text-6xl">{sentimentEmoji}</span>
            <div>
              <p className={`text-2xl font-bold capitalize ${
                analysis.overallSentiment === 'positive' ? 'text-green-500' :
                analysis.overallSentiment === 'negative' ? 'text-red-500' :
                'text-gray-500'
              }`}>
                {analysis.overallSentiment}
              </p>
              <p className="text-gray-600">
                Score: {(analysis.sentimentScore * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="h-64">
            <h4 className="text-lg font-semibold mb-2 text-center">Sentiment Breakdown</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Comment Timeline */}
          <div className="h-64">
            <h4 className="text-lg font-semibold mb-2 text-center">Comment Sentiment Over Time</h4>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="author" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    interval={0}
                    fontSize={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
                            <p className="font-medium">{data.author}</p>
                            <p className={`text-sm ${
                              data.sentiment === 'positive' ? 'text-green-600' :
                              data.sentiment === 'negative' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {data.sentiment}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#8884d8">
                    {barData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.sentiment as keyof typeof COLORS]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 italic">No comment data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Key Themes */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Key Themes</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keyThemes && analysis.keyThemes.length > 0 ? (
              analysis.keyThemes.map((theme, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))
            ) : (
              <p className="text-gray-500 italic">No key themes identified</p>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Community Insights</h4>
          {analysis.insights && analysis.insights.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {analysis.insights.map((insight, index) => (
                <li key={index} className="text-gray-700">{insight}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No insights available</p>
          )}
        </div>

        {/* Recent Comments */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Recent Comments</h4>
          <div className="space-y-3">
            {analysis.comments && analysis.comments.length > 0 ? (
              analysis.comments.slice(0, 5).map((comment) => (
                <div 
                  key={comment.id} 
                  className={`p-3 rounded-lg border ${
                    comment.sentiment === 'positive' ? 'border-green-200 bg-green-50' :
                    comment.sentiment === 'negative' ? 'border-red-200 bg-red-50' :
                    'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold">{comment.author}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      comment.sentiment === 'positive' ? 'bg-green-200 text-green-800' :
                      comment.sentiment === 'negative' ? 'bg-red-200 text-red-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {comment.sentiment}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No comments available</p>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
