import * as assert from 'power-assert';
import RandomGenerator from '../../../src/random/generator/RandomGenerator';
import MersenneTwister from '../../../src/random/generator/MersenneTwister';
import * as p from './RandomGenerator.properties';
import * as fc from '../../../src/fast-check';

function rng_for(seed: number): RandomGenerator {
    return MersenneTwister.from(seed);
}

describe("MersenneTwister", () => {
    it('Should produce the right sequence for seed=42', () => {
        let g = rng_for(42);
        let data = [];
        for (let idx = 0 ; idx !== 1000 ; ++idx) {
            const [v, nextG] = g.next();
            data.push(v);
            g = nextG;
        }
        assert.deepEqual(data, [
            1608637542, 3421126067, 4083286876, 
            787846414, 3143890026, 3348747335, 
            2571218620, 2563451924, 670094950, 
            1914837113, 669991378, 429389014, 
            249467210, 1972458954, 3720198231, 
            1433267572, 2581769315, 613608295, 
            3041148567, 2795544706, 88409749, 
            242285876, 4165731073, 3100961111, 
            3575313899, 4031053213, 911989541, 
            3344769, 780932287, 4261516219, 
            787716372, 2652062880, 1306710475, 
            2627030329, 2253811733, 30349564, 
            1855189739, 99052376, 1250819632, 
            2253890010, 2627888186, 1717389822, 
            599121577, 200427519, 1254751707, 
            4182248123, 1573512143, 999745294, 
            1958805693, 389151677, 3372305070, 
            2655947709, 857592370, 1642661739, 
            2208620086, 4222944499, 2544401215, 
            2004731384, 199502978, 3693415908, 
            2609385266, 2921898630, 732395540, 
            1934879560, 279394470, 56972561, 
            4075432323, 4046725720, 4147358011, 
            2419304461, 3472040177, 1655351289, 
            1308306184, 68574553, 419498548, 
            991681409, 2938758483, 1035196507, 
            1890440558, 2934594491, 524150214, 
            2619915691, 2126768636, 3578544903, 
            147697582, 744595490, 3905501389, 
            1679592528, 1111451555, 782698033, 
            2845511527, 3244252547, 1338788865, 
            1826030589, 2233675141, 893102645, 
            2348102761, 2438254339, 793943861, 
            134489564, 4164334270, 3617585553, 
            3329170137, 1931679275, 4035117217, 
            1697157321, 3843254205, 3979969507, 
            2567960845, 3123609438, 3959419695, 
            1402481934, 380072391, 2450038221, 
            841739990, 2236966139, 194249720, 
            4128202429, 1397283111, 3627245268, 
            1669356239, 3209715436, 1165435217, 
            2317960046, 3559400500, 2520077079, 
            1532243865, 4145739992, 1206604539, 
            2607192251, 2330861947, 1185407468, 
            605264936, 1272485020, 3445409806, 
            709816108, 320192576, 67157848, 
            4238647110, 1818495496, 3316766039, 
            1696003200, 853477355, 1260522119, 
            23717335, 60472382, 3502380170, 
            854021618, 3035929168, 3055190407, 
            3131061922, 3393778082, 3312580896, 
            2602578298, 318019332, 3978431977, 
            1539598566, 2796354553, 497653800, 
            3929721883, 3707000966, 3650887880, 
            2677045063, 1930375947, 1421196193, 
            409783328, 272981039, 1592652278, 
            1335658902, 2872651325, 1396651735, 
            2860114724, 3133634658, 2539604651, 
            2738288487, 1179921109, 3810549722, 
            2410522146, 2028147648, 1644658402, 
            513653348, 4173471662, 3063363021, 
            3646057090, 3267546880, 3099804676, 
            2410667225, 1013547510, 3311278846, 
            1099805069, 2120835942, 173660954, 
            2245120392, 3052273870, 1836274702, 
            476272473, 109174313, 1886935931, 
            463390156, 866377394, 134987326, 
            3847275359, 2733361894, 2041699568, 
            1350148659, 2419250172, 2184294495, 
            2987218819, 3897968349, 598424036, 
            1070701974, 2595952870, 1762581228, 
            2318599822, 3245067434, 872141340, 
            982680611, 4049525260, 330626207, 
            2572107590, 1244473018, 2984078578, 
            692440149, 3781580571, 3993020993, 
            2681580201, 3470850604, 1269737021, 
            2720448440, 453094388, 3742894725, 
            1960801051, 3451745307, 938194539, 
            801312299, 1788896595, 3833511709, 
            3793659837, 2316457290, 1393051263, 
            3467929081, 524363766, 3848682843, 
            1530287576, 1365814502, 3894798525, 
            472669408, 1168799104, 978974072, 
            2781807898, 1834414013, 2235000, 
            3513346675, 1514271692, 3696809704, 
            1309025538, 29859174, 707191493, 
            2193642951, 2293896602, 1792766600, 
            2082328893, 953945764, 2973990112, 
            514817842, 1157117161, 1450046123, 
            1048511127, 4049766350, 722804538, 
            1388146037, 939585183, 2228188767, 
            2397029847, 3019443432, 1734463155, 
            1561777264, 278710077, 4173772272, 
            1090558393, 4133679667, 1060324619, 
            1081396733, 2990604070, 2135666049, 
            3059178882, 1292262512, 636028516, 
            1223380592, 4285262775, 158428240, 
            1145815738, 2618058864, 4194529281, 
            2158989953, 1765390555, 221099573, 
            141951830, 1196777444, 1482069727, 
            3900972256, 2724518272, 1028910482, 
            2923607677, 622318721, 2280346676, 
            2102183595, 1923214041, 4233336479, 
            2374657733, 1039619487, 2545613046, 
            2886800195, 347262390, 3271131338, 
            1587653815, 1020645498, 1040069008, 
            3127665406, 3449458981, 1579616535, 
            2019925828, 2715732851, 4223770209, 
            2720989381, 1712937941, 2301134730, 
            3506548222, 387791599, 3428866191, 
            3587596896, 647326920, 1377739899, 
            2182697146, 801090885, 2988493263, 
            175127900, 3686622978, 2537865875, 
            1399982843, 2910116794, 945928099, 
            71244178, 3054363993, 2199422914, 
            3476780542, 972791954, 1497509011, 
            2770996063, 413075142, 748898099, 
            4039516648, 2967554976, 1707558823, 
            1661015679, 2223725094, 4023224657, 
            3597937511, 590647936, 2902066954, 
            1464868827, 3157729208, 487365080, 
            897955761, 3971528854, 2325501342, 
            3768143837, 2988371241, 1107850850, 
            981614854, 2834609915, 751425679, 
            3509942617, 4218380911, 2384569336, 
            2218934259, 2274831931, 1120252784, 
            1038747649, 4278877056, 399873327, 
            4146444541, 3853512331, 2397852100, 
            3867266084, 3790894239, 2719150074, 
            810490870, 1456121864, 1197743336, 
            1499843682, 3008013970, 3117955887, 
            3636381903, 3853059202, 3677884819, 
            3810007191, 1737349173, 3349539959, 
            3812943520, 2757504919, 3654709875, 
            361378378, 4018521712, 694190023, 
            3373012387, 3859260837, 2873282663, 
            2604592979, 2494030077, 39501026, 
            1598942319, 435816957, 4037842392, 
            2849718370, 4181854360, 21739356, 
            1219431313, 690665343, 1311527789, 
            2356793681, 2085695169, 2971667253, 
            1925967010, 2800152271, 4271162300, 
            963229352, 755593187, 3058786464, 
            77633091, 1018977056, 2121257357, 
            1397581076, 768037679, 3206156179, 
            1573971447, 2790152063, 3196188039, 
            3647386758, 3096413378, 2824425872, 
            1323111039, 2440866848, 2330192559, 
            402330059, 2185339834, 1579327346, 
            2733027797, 1139035510, 1075725333, 
            1047927533, 2533475997, 4179048485, 
            4204312805, 1688341868, 2090541618, 
            3831310773, 3891664647, 2710719770, 
            1865709594, 3413688545, 1503575316, 
            2158809885, 2770697824, 2477783323, 
            2873006958, 2115347391, 3711571424, 
            838562244, 988638203, 3102908220, 
            2144019247, 1205908114, 2456739331, 
            104436258, 3300914367, 2772282416, 
            187276799, 760684560, 4271561899, 
            4039238875, 2018396317, 4097092060, 
            1200702509, 3929312628, 3794577925, 
            1589819490, 3211427707, 66385640, 
            4093412388, 3987097879, 1420561756, 
            1839036912, 2374107437, 4151750836, 
            2457977438, 4138716258, 4210492091, 
            3663647712, 323609715, 1264648382, 
            1312958716, 1653982164, 819956639, 
            3655604182, 1153090720, 1361169663, 
            2084261186, 727965823, 1600677905, 
            2391443224, 1695186921, 4020754142, 
            3625867829, 2989425209, 3994391874, 
            2448394087, 302434989, 417369879, 
            897299057, 2641435935, 2882539438, 
            4252248917, 1540376214, 601656257, 
            1091624574, 2226208922, 1268263401, 
            3768288641, 1385344985, 3181576976, 
            3645008999, 2993659808, 586784136, 
            3017146154, 3044749557, 1544002735, 
            2374343718, 1260967388, 1273501353, 
            3476179702, 1802945049, 3479410530, 
            1100400433, 3724047256, 2626431383, 
            3922338316, 350444347, 2196198905, 
            22268806, 2153996088, 2696785955, 
            3428651692, 834400275, 2791573824, 
            304688903, 3014924799, 1704173549, 
            3417903503, 218049165, 3822543819, 
            3807991666, 1451678166, 118613134, 
            1613116507, 2486205793, 403649345, 
            1883232031, 2483694294, 2886330302, 
            154370901, 1409404978, 1999728280, 
            665898681, 2330640958, 4216974525, 
            1230685308, 3603191957, 2537609529, 
            3695409721, 130997589, 1074821424, 
            160409267, 166793897, 3533042501, 
            1302515470, 1547007029, 2306751466, 
            545720763, 1402956388, 2243017696, 
            3555670279, 3307097140, 1166267963, 
            926944235, 4145725035, 2675294212, 
            1963938918, 366564547, 3616461573, 
            221971308, 834855903, 2282150771, 
            1766751581, 2322010158, 3004382050, 
            2737740598, 594221991, 3118538547, 
            570137231, 4191252748, 4164129137, 
            2217493115, 3069162601, 1387087517, 
            176383634, 3415298704, 1712922743, 
            1163215678, 1861957394, 1885367899, 
            3195638841, 336967606, 1077437785, 
            108880612, 791707097, 4134543476, 
            347346749, 3590507286, 1839596670, 
            2989186440, 2957084555, 1756439540, 
            249939584, 744293433, 3930813049, 
            671891968, 1899888366, 1074785057, 
            1029878879, 2358910589, 403182709, 
            3069166127, 785403480, 2835526119, 
            4014136556, 1202306932, 2741351296, 
            4101115151, 2219193532, 3169243110, 
            2822271679, 2380932542, 1871200836, 
            2627320597, 3135495004, 1802168566, 
            204939202, 1063996491, 2431111321, 
            1528891023, 681381298, 3254924260, 
            516103253, 61819576, 1468362012, 
            498528205, 394274011, 197579844, 
            404401198, 174928880, 1337509981, 
            3674175213, 4206965693, 3022187507, 
            753037764, 2036561099, 73706383, 
            420194521, 3278625241, 2111474095, 
            3465664852, 2033545766, 1487365731, 
            743896352, 1995758845, 1863378653, 
            2790756708, 1711564822, 206411513, 
            2645056009, 4076549877, 2727706436, 
            3808263267, 194579233, 1120529587, 
            1608948958, 65732489, 2688047865, 
            4009078418, 2160953785, 2151949919, 
            3678595840, 2316608503, 2829067588, 
            2937602028, 699798019, 2645060623, 
            303090455, 4053983567, 2759169782, 
            4055529729, 113865200, 3724591067, 
            2515886975, 2733332639, 4038258138, 
            3440051027, 2471642775, 2908415883, 
            1667177137, 2462592674, 2762901883, 
            551904800, 1968181152, 3484095420, 
            2343406258, 3524619690, 4043560548, 
            2688390411, 1658298178, 3523706432, 
            4128282016, 2798105767, 3888451401, 
            887702570, 840916523, 1176654108, 
            297904524, 921653259, 432838238, 
            1620315437, 78262145, 167345404, 
            405629426, 2655380209, 2933491746, 
            1445489366, 305752912, 2816307289, 
            1369989895, 1655265884, 3628711833, 
            2927508425, 99952217, 1462971389, 
            3498115489, 1119674482, 1210557032, 
            2130464646, 507514051, 2975941433, 
            2992463348, 1496094321, 2701288940, 
            4022873162, 3768713628, 168303991, 
            3157106083, 1795064536, 3450924308, 
            4155726844, 1211329272, 2353521315, 
            762097033, 1818793828, 3223865800, 
            2441776023, 3465328831, 2473577186, 
            4254187184, 3142403170, 1772179439, 
            548423203, 1597805521, 1073812464, 
            3334668262, 2493417567, 1463740055, 
            3724237462, 3997572285, 2413199071, 
            3686854692, 1024765707, 1842515312, 
            2919911094, 3224966668, 3177883926, 
            3240736984, 1023216482, 442913640, 
            1622333213, 3876435216, 2294919024, 
            2170042429, 2132714067, 3549607791, 
            1673396952, 1374602581, 1278333324, 
            3846243002, 429431826, 1671608496, 
            229717603, 46547339, 4116904380, 
            3888585960, 3638452114, 392073291, 
            1524306184, 1371441606, 4109428507, 
            4080485069, 2906704606, 4082826623, 
            2072411699, 2462896978, 2117529081, 
            2713720174, 357703823, 1926058868, 
            393866308, 1259330658, 2587464075, 
            1411603480, 2378136499, 2888444794, 
            913659348, 3231423971, 4063874612, 
            3399806102, 3355640975, 3391384120, 
            487326758, 391727212, 3998310068, 
            2123519017, 4184364217, 247212966, 
            4277492109, 2360208606, 239964793, 
            1896359044, 3165543586, 3812660438, 
            2344690396, 1507168490, 3031523146, 
            502798993, 4160328430, 614144587, 
            2955066376, 3270663241, 3594732473, 
            2655226347, 3723172752, 434318588, 
            3601247461, 361235974, 1830048941, 
            3010639500, 955958439, 312514729, 
            1703605640, 3529862065, 3830668058, 
            3033287289, 629662913, 349390340, 
            2204719132, 364375204, 1001706917, 
            4237584722, 2496687751, 1607480815, 
            3707151724, 1591895872, 3781117269, 
            3490947571, 1016555152, 4068401662, 
            3898514758, 4234842328, 2542142764, 
            3235734659, 1504175907, 1616022597, 
            3041615099, 358632862, 2068743954, 
            3337820604, 1623444331, 2398327989, 
            3028314278, 1822019674, 1068262089, 
            3892762457, 1418423826, 477589542, 
            1865956477, 2115808706, 1089556652, 
            48763532, 1740329713, 2012882139, 
            2454457981, 241820729, 3182458515, 
            510319067, 3295076807, 504771388, 
            3533857662, 2788337000, 3196364710, 
            3204238336, 2925042050, 2505549772, 
            1020082523, 4132499645, 1718944248, 
            1610056894, 2051769851, 1227124080, 
            356015512, 3730604855, 2269332384, 
            960336805, 1874048116, 4137009285, 
            3445033017, 52203051, 4200051372, 
            4165597855, 2388023468, 185370428, 
            1385927470, 3827430548, 186404943, 
            2266458997, 3971312852, 4264751306, 
            3947571963, 316953828, 1086584483, 
            2378786018, 2986768018, 4163122707, 
            323988920, 2246688145, 713889838, 
            2703246568, 931188016, 2988217869, 
            1264841870, 1952239006, 4277063168, 
            2695341428, 2993270325, 2509610869, 
            1650134274, 3870444175, 3165823446, 
            195190712, 3930987466, 1206727691, 
            4117595465, 4081986271, 248523535, 
            3823653831, 1694458213, 1957030859, 
            458513815, 2663449243, 1441649012, 
            1191343111, 728769657, 807974235, 
            2778192547, 1991569497, 1667600007, 
            1517636281, 985242939, 2506783921, 
            1142194715, 333867739, 1547670372, 
            4184993832, 1116476131, 4235742911, 
            1946654618]);
    });
    it('Should return the same sequence given same seeds', () => fc.assert(p.sameSeedSameSequences(rng_for)));
    it('Should return the same sequence if called twice', () => fc.assert(p.sameSequencesIfCallTwice(rng_for)));
    it('Should generate values between 0 and 2**32 -1', () => fc.assert(p.valuesInRange(rng_for)));
});
