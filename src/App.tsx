import React, { useCallback, useEffect, useState } from 'react';
import {
  CssBaseline, createTheme, ThemeProvider, debounce,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GraphData, darkTheme, lightTheme } from './defs';
import drawForceDirectedGraph from './draw';

function App() {
  // State to store the graph data
  const [data, setData] = useState(null);

  // State to manage window size for responsive design
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Determine if the user prefers dark mode
  const prefersDarkMode: boolean = useMediaQuery('(prefers-color-scheme: dark)');
  // Set the color theme based on the user's preference
  const colorTheme = prefersDarkMode ? darkTheme : lightTheme;
  // Create a theme instance for MUI components
  const theme = React.useMemo(
    () => createTheme({
      palette: { mode: prefersDarkMode ? 'dark' : 'light' },
    }),
    [prefersDarkMode],
  );

  // Fetch graph data on component mount
  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        const response = await fetch('http://localhost:3000/analyze');
        const jsonData: GraphData = await response.json();
        setData(data);
        drawForceDirectedGraph(jsonData, windowSize, colorTheme);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  });

  // Handle window resize with a debounce to improve performance
  const handleResize: () => void = useCallback((): void => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Effect to handle window resize events
  useEffect((): () => void => {
    const debounceHandleResize = debounce(handleResize, 250);
    window.addEventListener('resize', debounceHandleResize);
    return () => window.removeEventListener('resize', debounceHandleResize);
  }, [handleResize]);

  // Redraw the graph on data, window size, or theme change
  useEffect((): void => {
    if (data) drawForceDirectedGraph(data, windowSize, colorTheme);
  }, [data, windowSize, colorTheme]);

  // Render the main graph and tooltip elements
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div id="graph" data-testid="graph" />
      <div
        id="tooltip"
        data-testid="tooltip"
        style={{
          display: 'none',
          position: 'absolute',
          border: `1px solid ${colorTheme.tooltipBorderColor}`,
          background: colorTheme.tooltipBackgroundColor,
          color: colorTheme.tooltipTextColor,
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        Tooltip
      </div>
    </ThemeProvider>
  );
}

export default App;
