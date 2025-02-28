"use client";

// import React, { useState, useEffect, useRef } from 'react';
import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ScrollArea } from "../components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { saveAs } from 'file-saver';

// const API_BASE_URL = process.env.NODE_ENV === 'production' ?  process.env.NEXT_PUBLIC_API_BASE_URL_PROD : process.env.NEXT_PUBLIC_API_BASE_URL_DEV;
// const API_BASE_URL = process.env.NODE_ENV === 'production' ?  "https://shamurai.myqnapcloud.com:5002/api" : process.env.NEXT_PUBLIC_API_BASE_URL_DEV;
const API_BASE_URL = 'http://localhost:5001/api'

//
// Define data interfaces
//
interface DayData {
  day: number;
  emojis: string[];
  day_emojis: string[];
  month_emojis: string[];
  year_emojis: string[];
  'Day Officer': string;
  'Day Pillar': string;
}

interface DayStruct {
  day: number;
  Favorable: string;
  Heavenly: string;
  Ideal: string;
  Clash: string;
  'Month Clash': string;
  'Day Officer': string;
  'Day Pillar': string;
  'Month Ten God': string;
}

interface CalendarData {
  [date: string]: DayData;
}

interface CalendarStructData {
  [date: string]: DayStruct;
}

interface DayDetails {
  'Day Pillar': string;
  'Day Officer': string;
  'Year Breaker': string;
  'Month Ten God': string;
  'Clash or Neutral': string;
  'Favorable or Neutral': string;
  'Ideal or Neutral': string;
  'Heavenly Combo or Neutral': string;
  '10 Gods': string;
  'Focus': string;
  'Advice': string;
}

interface BaziDetails {
  day_master: string;
  natal_chart: {
    year_pillar: {
      heavenly_stem: string;
      earthly_branch: string;
      hidden_elements: string;
    };
    month_pillar: {
      heavenly_stem: string;
      earthly_branch: string;
      hidden_elements: string;
    };
    day_pillar: {
      heavenly_stem: string;
      earthly_branch: string;
      hidden_elements: string;
    };
    hour_pillar: {
      heavenly_stem: string;
      earthly_branch: string;
      hidden_elements: string;
    };
  };
  current_annual_pillar: {
    year: string;
    heavenly_stem: string;
    earthly_branch: string;
    hidden_elements: string;
  };
  current_monthly_pillar: {
    month: string;
    heavenly_stem: string;
    earthly_branch: string;
    hidden_elements: string;
  };
  key_relationships: {
    annual_pillar_to_day_master: {
      heavenly_stem: string;
      hidden_elements: string;
    };
    monthly_pillar_to_day_master: {
      heavenly_stem: string;
      hidden_elements: string;
    };
  };
}


const MobileEmojiCalendar: React.FC<{ uuid?: string }> = (inputData) => {
  console.log("init", inputData.uuid);
  const userMode = (inputData.uuid !== undefined);
  console.log(userMode);
  //
  // State declarations
  //
  const [people, setPeople] = useState<string[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [baziDetails, setBaziDetails] = useState<BaziDetails | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [calendarStructData, setCalendarStructData] = useState<CalendarStructData>({});
  const [dayDetails, setDayDetails] = useState<DayDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyViewDate, setDailyViewDate] = useState<Date>(new Date());
  const [dailyViewDetails, setDailyViewDetails] = useState<DayDetails | null>(null);

  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  //
  // View type state
  //
  const [viewType, setViewType] = useState<'month' | 'monthList' | 'list' | 'detail' | 'daily' | 'baziDetails'>('month');
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  //
  // useEffect hooks and fetch functions
  //
  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    if (selectedPerson) {
      fetchCalendarData();
      fetchCalendarStructData();
    }
  }, [currentDate, selectedPerson]);

  // Effect to fetch data whenever dailyViewDate or selectedPerson changes
  useEffect(() => {
    fetchDayDetailsForDailyView(dailyViewDate);
  }, [dailyViewDate, selectedPerson]);

  useEffect(() => {
    if (viewType === 'baziDetails') {
      fetchBaziDetails();
    }
  }, [viewType, selectedPerson]);

  useEffect(() => {
    console.log('Bazi details updated:', baziDetails);
  }, [baziDetails]);

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/people`);
      const data = await response.json();
      setPeople(data);
      var specificPerson = data.find((person: string) => person === 'Jeannie');
      if (inputData !== undefined) {
        specificPerson = await data.find((person: string) => person === inputData.uuid);
      }
      if (specificPerson) {
        setSelectedPerson(specificPerson);
      } else {
        setSelectedPerson(data[0]); // Fallback to the first person if specific name is not found
      }
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  };

  const fetchCalendarData = async () => {
    if (!selectedPerson) return; // Add this check to prevent the API call if selectedPerson is empty
    try {
      const response = await fetch(`${API_BASE_URL}/calendar?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}&person=${selectedPerson}`);
      const data = await response.json();
      setCalendarData(data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  const fetchCalendarStructData = async () => {
    if (!selectedPerson) return; // Add this check to prevent the API call if selectedPerson is empty
    try {
      const response = await fetch(`${API_BASE_URL}/calendar_struct?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}&person=${selectedPerson}`);
      const data = await response.json();
      setCalendarStructData(data);
    } catch (error) {
      console.error('Error fetching calendar struct data:', error);
    }
  };

  const fetchDayDetails = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (!selectedPerson) return; // Add this check to prevent the API call if selectedPerson is empty
    try {
      const response = await fetch(`${API_BASE_URL}/day_details?date=${dateString}&person=${selectedPerson}`);
      const data = await response.json();
      setDayDetails(data);
      setSelectedDate(date);
      setAiInsight(''); // Clear previous AI insight
      setIsSheetOpen(true);
    } catch (error) {
      console.error('Error fetching day details:', error);
    }
  };

  const fetchDayDetailsForDailyView = async (date: Date) => {
    // Adjust the date to UTC to avoid timezone issues
    const adjustedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dateString = adjustedDate.toISOString().split('T')[0];
    if (!selectedPerson) return; // Add this check to prevent the API call if selectedPerson is empty
    try {
      const response = await fetch(`${API_BASE_URL}/day_details?date=${dateString}&person=${selectedPerson}`);
      const data = await response.json();
      setDailyViewDetails(data);
    } catch (error) {
      console.error('Error fetching day details for daily view:', error);
    }
  };

  const fetchBaziDetails = async () => {
    console.log(selectedPerson);
    if (!selectedPerson) return;
    try {
      const response = await fetch(`${API_BASE_URL}/person_bazi?name=${selectedPerson}`);
      const data = await response.json();
      setBaziDetails(data);
    } catch (error) {
      console.error('Error fetching Bazi details:', error);
    }
  };

  const fetchAiInsight = async (aiProvider: 'Anthropic' | 'OpenAI') => {
    if (!dayDetails || !selectedDate) return;

    setIsLoadingAi(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`${API_BASE_URL}/ai_insight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dayDetails,
          aiProvider,
          date: dateString,
          person: selectedPerson,
        }),
      });
      const data = await response.json();
      setAiInsight(data.ai_insight);
    } catch (error) {
      console.error('Error fetching AI insight:', error);
      setAiInsight('Failed to fetch AI insight. Please try again.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const generateMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return date.toISOString().split('T')[0];
    });
  };

  const getEmojisForDay = (dayData: DayStruct) => {
    const favorableEmoji = dayData?.Favorable ? '🌟' : '';
    const idealEmoji = dayData?.Ideal ? '👍' : '';
    // const heavenlyEmoji = dayData?.Heavenly ? '✨' : '';
    const clashEmoji = dayData?.Clash ? '❌' : '';
    const monthlyClashEmoji = dayData?.['Month Clash'] ? '❗' : '';

    return [favorableEmoji, idealEmoji, clashEmoji, monthlyClashEmoji].filter(Boolean);
  };

  const getDayIcons = (dayData: DayStruct): string[] => {
    // Parse Clash, Favorable, and Ideal presence
    console.log("hello===============", dayData);

    const clashPillars = dayData?.Clash.split(',').map((p) => p.trim()) || [];
    const favorablePillars = dayData?.Favorable.split(',').map((p) => p.trim()) || [];
    const idealPillars = dayData?.Ideal.split(',').map((p) => p.trim()) || [];

    const clashInDay = clashPillars.includes('Day');
    const clashInMonth = clashPillars.includes('Month');
    const clashInYear = clashPillars.includes('Year');
    const totalClashes = clashPillars.length;

    const favorableCount = favorablePillars.filter((p) => p !== '').length; // Ensure no empty items
    const idealCount = idealPillars.filter((p) => p !== '').length; // Ensure no empty items
    const hasFavorableOrIdeal = favorableCount > 0 || idealCount > 0;

    // Initialize the icon array
    let icons: string[] = [];

    // Handle Clash precedence
    if (clashInDay || totalClashes > 1) {
      icons = ['💥']; // Worst Clash (Day Clash or multiple Clashes)
    } else if (clashInMonth || clashInYear) {
      if (hasFavorableOrIdeal) {
        icons = ['⚠️️💡']; // Clash with Favorable or Ideal context
      } else {
        icons = ['⚠️']; // Regular Clash
      }
    } else if (favorableCount >= 2) {
      icons = ['🌈']; // Favorable in 2 or 3 pillars
    } else if (favorablePillars.includes('Day') && hasFavorableOrIdeal) {
      icons = ['🌈']; // Favorable in Day and Ideal in any pillar
    } else if (
      (favorablePillars.includes('Month') && idealCount > 0) ||
      (favorablePillars.includes('Year') && idealCount > 0)
    ) {
      icons = ['🌈']; // Favorable in Month/Year and Ideal in any pillar
    } else if (favorableCount === 1 && idealCount === 0) {
      icons = ['🌟']; // Favorable in a single pillar only
    } else if (idealCount >= 2) {
      icons = ['✨']; // Ideal in 2 or 3 pillars
    } else if (idealCount === 1) {
      icons = ['👍']; // Ideal in a single pillar only
    } else {
      // icons = ['➖']; // Neutral / No significant focus
    }

    // Single return statement
    return icons;
  };

  const renderBaziDetailsView = () => {
    const displayValue = (value: string | null | undefined) => value ?? 'N/A';

    // Define the desired order of keys with explicit typing
    const natalChartOrder: Array<keyof BaziDetails['natal_chart']> = ['year_pillar', 'month_pillar', 'day_pillar', 'hour_pillar'];

    // Define a mapping from key names to display names
    const keyDisplayNames: { [key: string]: string } = {
      year_pillar: 'Year Pillar',
      month_pillar: 'Month Pillar',
      day_pillar: 'Day Pillar',
      hour_pillar: 'Hour Pillar',
    };

    // Define the desired order of keys for key relationships
    const keyRelationshipsOrder: Array<keyof BaziDetails['key_relationships']> = [
      'annual_pillar_to_day_master',
      'monthly_pillar_to_day_master'
    ];

    // Define a mapping from key names to display names
    const keyRelationshipDisplayNames: { [key: string]: string } = {
      annual_pillar_to_day_master: 'Annual Pillar to Day Master',
      monthly_pillar_to_day_master: 'Monthly Pillar to Day Master'
    };

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Bazi Details for {selectedPerson}</h2>
        {baziDetails ? (
          <div className="bg-gray-50 p-3 rounded-md space-y-4">
            <div>
              <h3 className="font-bold">Day Master:</h3>
              <p>{displayValue(baziDetails.day_master)}</p>
            </div>
            <div>
              <h3 className="font-bold">Natal Chart:</h3>
              {natalChartOrder.map((key) => {
                const pillar = baziDetails.natal_chart[key];
                return (
                  <div key={key}>
                    <h4 className="font-semibold">{keyDisplayNames[key] || key.replace('_', ' ')}:</h4>
                    <p>Heavenly Stem: {displayValue(pillar?.heavenly_stem)}</p>
                    <p>Earthly Branch: {displayValue(pillar?.earthly_branch)}</p>
                    <p>Hidden Elements: {displayValue(pillar?.hidden_elements)}</p>
                  </div>
                );
              })}
            </div>
            <div>
              <h3 className="font-bold">Current Annual Pillar:</h3>
              <p>Year: {displayValue(baziDetails.current_annual_pillar.year)}</p>
              <p>Heavenly Stem: {displayValue(baziDetails.current_annual_pillar.heavenly_stem)}</p>
              <p>Earthly Branch: {displayValue(baziDetails.current_annual_pillar.earthly_branch)}</p>
              <p>Hidden Elements: {displayValue(baziDetails.current_annual_pillar.hidden_elements)}</p>
            </div>
            <div>
              <h3 className="font-bold">Current Monthly Pillar:</h3>
              <p>Month: {displayValue(baziDetails.current_monthly_pillar.month)}</p>
              <p>Heavenly Stem: {displayValue(baziDetails.current_monthly_pillar.heavenly_stem)}</p>
              <p>Earthly Branch: {displayValue(baziDetails.current_monthly_pillar.earthly_branch)}</p>
              <p>Hidden Elements: {displayValue(baziDetails.current_monthly_pillar.hidden_elements)}</p>
            </div>
            <div>
              <h3 className="font-bold">Key Relationships:</h3>
              {keyRelationshipsOrder.map((key) => {
                const relationship = baziDetails.key_relationships[key];
                return (
                  <div key={key}>
                    <h4 className="font-semibold">{keyRelationshipDisplayNames[key] || key.replace('_', ' ')}:</h4>
                    <p>Heavenly Stem: {displayValue(relationship.heavenly_stem)}</p>
                    <p>Hidden Elements: {displayValue(relationship.hidden_elements)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center">Loading Bazi details...</div>
        )}
      </div>
    );
  };

  const renderMonthStructView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let days = [];
    let week = [];

    for (let i = 0; i < firstDay; i++) {
      week.push(<div key={`empty-${i}`}></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayData = calendarStructData[dateString];
      // const emojis = getEmojisForDay(dayData);
      const emojis = getDayIcons(dayData);

      week.push(
        <div
          key={dateString}
          className="aspect-square border flex flex-col items-center p-0.5"
          onClick={() => fetchDayDetails(date)}
        >
          <div className="text-sm font-bold">{day}</div>
          <div className="flex-grow flex flex-col items-center justify-center overflow-hidden">
            {emojis.length > 0 ? (
              <div className="text-2xl flex items-center justify-center h-full">{emojis[0]}</div>
            ) : (
              <div className="text-2xl flex items-center justify-center h-full">&nbsp;</div>
            )}
          </div>
        </div>
      );

      if (week.length === 7) {
        days.push(<div key={`week-${days.length}`} className="grid grid-cols-7 gap-0.5">{week}</div>);
        week = [];
      }
    }

    if (week.length > 0) {
      days.push(<div key={`week-${days.length}`} className="grid grid-cols-7 gap-0.5">{week}</div>);
    }

    return (
      <div className="space-y-0.5">
        <div className="grid grid-cols-7 gap-0.5 text-center font-bold text-xs mb-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        {days}
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // const extractEmoji = (str: string) => {
    //   // const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    //   const emojiRegex = /^\p{Emoji}/u;
    //   const match = str.match(emojiRegex);
    //   return match ? match[0] : '';
    // };

    let days = [];
    let week = [];

    for (let i = 0; i < firstDay; i++) {
      week.push(<div key={`empty-${i}`}></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const dayData = calendarData[dateString];

      // const emojis = dayData?.emojis.map(extractEmoji).slice(0, 5) || [];
      const emojis = dayData.emojis || [];
      const dayEmojis = dayData.day_emojis || [];
      const monthEmojis = dayData.month_emojis || [];
      const yearEmojis = dayData.year_emojis || [];

      week.push(
        <div
          key={dateString}
          className="aspect-square border flex flex-col items-center p-0.5"
          onClick={() => fetchDayDetails(date)}
        >
          <div className="text-xs font-bold">{day}</div>
          <div className="flex-grow flex flex-col items-center justify-center overflow-hidden">
            {/* {emojis.map((emoji, index) => (
              <div key={index} className="text-sm">{emoji}</div>
            ))} */}
            {dayEmojis.map((emoji, index) => (
              <div key={index} className="text-sm">Day: {emoji}</div>
            ))}
            {monthEmojis.map((emoji, index) => (
              <div key={index} className="text-sm">Month: {emoji}</div>
            ))}
            {yearEmojis.map((emoji, index) => (
              <div key={index} className="text-sm">Year: {emoji}</div>
            ))}
            {/* {[...Array(5 - emojis.length)].map((_, index) => (
              <div key={`empty-${index}`} className="text-sm">&nbsp;</div>
            ))} */}
          </div>
        </div>
      );

      if (week.length === 7) {
        days.push(<div key={`week-${days.length}`} className="grid grid-cols-7 gap-0.5">{week}</div>);
        week = [];
      }
    }

    if (week.length > 0) {
      days.push(<div key={`week-${days.length}`} className="grid grid-cols-7 gap-0.5">{week}</div>);
    }

    return (
      <div className="space-y-0.5">
        <div className="grid grid-cols-7 gap-0.5 text-center font-bold text-xs mb-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        {days}
      </div>
    );
  };

  const renderListStructView = () => {
    const allDates = generateMonthDates();

    return (
      <div className="space-y-2">
        {allDates.map((dateString) => {
          const dayData = calendarStructData[dateString] || {};
          const date = new Date(dateString);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          const emojis = getDayIcons(dayData);

          return (
            <div
              key={dateString}
              className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => fetchDayDetails(date)}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-2xl">{emojis ? emojis.join(' ') : '−'}</div>
              </div>
              {
                Object.entries(dayData).map(([key, value]) => (
                  key !== 'emojis' && key != 'day' && (
                    <div key={key} className="text-xs mt-1">
                      <span className="font-semibold">{key}:</span> {value}
                    </div>
                  )
                ))
              }
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    const allDates = generateMonthDates();

    return (
      <div className="space-y-2">
        {allDates.map((dateString) => {
          const dayData = calendarData[dateString] || {};
          const date = new Date(dateString);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

          return (
            <div
              key={dateString}
              className="p-4 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => fetchDayDetails(date)}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-lg">{dayData.emojis ? dayData.emojis.join(' ') : '−'}</div>
              </div>
              {/*
              Object.entries(dayData).map(([key, value]) => (
                key !== 'emojis' && key != 'day' && (
                  <div key={key} className="text-xs mt-1">
                    <span className="font-semibold">{key}:</span> {value}
                  </div>
                )
              ))
                */}
            </div>
          );
        })}
      </div>
    );
  };

  const renderListDetailView = () => {
    const allDates = generateMonthDates();

    const downloadListAsCsv = () => {
      // Prepare CSV content
      const csvContent = [
        "Date,Day Pillar,Day Officer,Emojis", // CSV header
        ...allDates.map(dateString => {
          const dayData = calendarData[dateString] || {};
          const date = new Date(dateString);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

          const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });

          const dayPillar = dayData['Day Pillar'] || '';
          const dayOfficer = dayData['Day Officer'] || '';
          const emojis = dayData.emojis ? dayData.emojis.join(' ') : '';

          // Escape commas and quotes in the data
          return `"${formattedDate}","${dayPillar}","${dayOfficer}","${emojis}"`;
        })
      ].join('\n');

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${selectedPerson}_${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}_calendar.csv`);
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-end mb-2">
          <Button onClick={downloadListAsCsv} variant="outline">
            Download CSV
          </Button>
        </div>
        {allDates.map((dateString) => {
          const dayData = calendarData[dateString] || {};
          const date = new Date(dateString);
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

          return (
            <div
              key={dateString}
              className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => fetchDayDetails(date)}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2 text-lg">
                    <span>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    {dayData['Day Pillar'] && (
                      <span>{dayData['Day Pillar']}</span>
                    )}
                    {dayData['Day Officer'] && (
                      <span>{dayData['Day Officer']}</span>
                    )}
                  </div>
                  <div className="text-lg">
                    {dayData.emojis ? dayData.emojis.join(' ') : '−'}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                {Object.entries(dayData).map(([key, value]) => (
                  key !== 'emojis' && key !== 'day' && key !== 'Day Pillar' && key !== 'Day Officer' && (
                    <div key={key} className="bg-gray-50 p-2 rounded-md">
                      <h3 className="font-bold text-xs mb-1">{key}:</h3>
                      <p className="text-sm">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Define the type for DayDetails
  type DayDetails = {
    "Clash or Neutral": string;
    "Date": string;
    "Day Officer": string;
    "Day Pillar": string;
    "Month Ten God": string;
    "Favorable or Neutral": string;
    "Heavenly Combo or Neutral": string;
    "Ideal or Neutral": string;
    "Person's Day Pillar": string;
    [key: string]: string; // Add this to allow for additional string keys
  };

  // Update the configuration with proper typing
  const dayDetailsConfig: Array<{ key: keyof DayDetails; label: string }> = [
    // { key: "Date", label: "Date" },
    { key: "Day Pillar", label: "Day Pillar" },
    { key: "Day Officer", label: "Day Officer" },
    { key: "Person's Day Pillar", label: "Person's Day Pillar" },
    { key: "Month Ten God", label: "Month Ten God" },
    { key: "Clash Month?", label: "Clash Month" },
    { key: "Clash or Neutral", label: "Clash" },
    { key: "Favorable or Neutral", label: "Favorable" },
    { key: "Heavenly Combo or Neutral", label: "Heavenly Combo" },
    { key: "Ideal or Neutral", label: "Ideal" }
  ];

  const renderDayViewSheet = () => {
    if (!dayDetails || !selectedDate) return null;

    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[90vh] bg-white">
          <SheetHeader>
            <SheetTitle className="text-center">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </SheetTitle>
          </SheetHeader>
          <div className="text-3xl text-center mb-4 ">
            {calendarData[selectedDate.toISOString().split('T')[0]]?.emojis.join(' ') || ''}
          </div>
          <ScrollArea className="h-[calc(100%-6rem)] pb-4 text-black">
            <div className="space-y-4">
              {dayDetailsConfig.map(({ key, label }) => (
                dayDetails[key] && (
                  <div key={key} className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-bold text-sm">{label}:</h3>
                    <p className="text-sm mt-1">{dayDetails[key]}</p>
                  </div>
                )
                // {Object.entries(dayDetails).map(([key, value]) => (
                //   <div key={key} className="bg-gray-50 p-3 rounded-md">
                //   <h3 className="font-bold text-sm">{key}:</h3>
                //   <p className="text-sm mt-1">{value}</p>
                //   </div>
              ))}
              <div className="flex flex-col space-y-2 mt-4 text-white">
                {/* <Button onClick={() => fetchAiInsight('Anthropic') } className="bg-black" disabled={isLoadingAi}>
                  Get Claude Insight
                </Button> */}
                <Button onClick={() => fetchAiInsight('OpenAI')} className="bg-black" disabled={isLoadingAi}>
                  Get ChatGPT Insight
                </Button>
              </div>
              {isLoadingAi && <p className="text-center">Loading AI insight...</p>}
              {aiInsight && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-bold text-sm mb-2">AI Insight:</h3>
                  <p className="text-sm">{aiInsight}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  // Function to go to the previous day
  const prevDay = () => {
    setDailyViewDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  // Function to go to the next day
  const nextDay = () => {
    setDailyViewDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  // Render the daily view
  const renderDailyView = () => {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={prevDay} variant="outline" className="bg-white hover:bg-gray-100 px-4">
            ◀
          </Button>
          <h2 className="text-xl font-bold">
            {dailyViewDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <Button onClick={nextDay} variant="outline" className="bg-white hover:bg-gray-100 px-4">
            ▶
          </Button>
        </div>
        <div className="space-y-4">
          {dailyViewDetails ? (
            dayDetailsConfig.map(({ key, label }) => (
              dailyViewDetails[key] && (
                <div key={key} className="bg-gray-50 p-3 rounded-md">
                  <h3 className="font-bold text-sm">{label}:</h3>
                  <p className="text-sm mt-1">{dailyViewDetails[key]}</p>
                </div>
              )
            ))
          ) : (
            <div className="text-center">Loading day details...</div>
          )}
        </div>
      </div>
    );
  };

  var selectBlock = <Select value={selectedPerson} onValueChange={setSelectedPerson}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select a person" />
    </SelectTrigger>
    <SelectContent className='bg-white'>
      {people.map((person) => (
        <SelectItem key={person} value={person} className='hover:bg-gray-50'>{person}</SelectItem>
      ))}
    </SelectContent>
  </Select>;

  var userBlock = <h1><b>{inputData.uuid}</b></h1>;

  return (

    <div className="h-[100%] bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
      <div className="max-w-full h-full scroll-auto">
        <div className="flex flex-col h-full w-full bg-white px-2 pt-2">
          <div className="space-y-2 mb-4">
            <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'month' | 'monthList' | 'list' | 'detail')} className="w-full">
              <TabsList className="w-full ">
                <TabsTrigger value="month" className="flex-1 hover:bg-gray-50">Month</TabsTrigger>
                <TabsTrigger value="monthList" className="flex-1 hover:bg-gray-50">Month List</TabsTrigger>
                <TabsTrigger value="list" className="flex-1 hover:bg-gray-50">List</TabsTrigger>
                <TabsTrigger value="detail" className="flex-1 hover:bg-gray-50">Detail List</TabsTrigger>
                <TabsTrigger value="daily" className="flex-1 hover:bg-gray-50">Daily</TabsTrigger>
                <TabsTrigger value="baziDetails" className="flex-1 hover:bg-gray-50">Bazi Details</TabsTrigger>
              </TabsList>
            </Tabs>
            <div>
              {!userMode && selectBlock}
            </div>
            <div>
              {userMode && userBlock}
            </div>
          </div>
          {['month', 'monthList', 'list', 'detail'].includes(viewType) && (
            <div className="flex items-center justify-between">
              <Button onClick={prevMonth} variant="outline" className="bg-white hover:bg-gray-100 px-4">
                ◀
              </Button>
              <span className="text-lg font-bold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <Button onClick={nextMonth} variant="outline" className="bg-white hover:bg-gray-100 px-4">
                ▶
              </Button>
            </div>
          )}
          <ScrollArea className="flex-grow">
            {viewType === 'month' && renderMonthStructView()}
            {viewType === 'monthList' && renderMonthView()}
            {viewType === 'list' && renderListStructView()}
            {viewType === 'detail' && renderListDetailView()}
            {viewType === 'daily' && renderDailyView()}
            {viewType === 'baziDetails' && renderBaziDetailsView()}
          </ScrollArea>
          {renderDayViewSheet()}
        </div>
      </div>
    </div>
  );
};

export default MobileEmojiCalendar;
