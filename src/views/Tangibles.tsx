import { Coins, Gem, Sandwich, Clock, Calendar, Smartphone, MapPin, Info } from 'lucide-react';

import { TangiblesProps } from '../types';
import { calculatePercentile } from '../utils';

import PageHeader from '../components/PageHeader';


// Average values ( approximate )
const VALUES = {
    gold_g: 140, silver_kg: 2250, big_mac: 5.50, work_hour_de: 25, iphone: 1000,
    living_costs: { US: 3500, DE: 2500, CH: 5000, PK: 400, IN: 600 }
};
