import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, {
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    Line,
    Circle,
    Rect,
} from "react-native-svg";

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const NODES = [
    { x: 100, y: 280 },
    { x: 180, y: 140 },
    { x: 250, y: 320 },
    { x: 340, y: 90 },
    { x: 300, y: 210 },
    { x: 460, y: 220 },
    { x: 520, y: 340 },
    { x: 420, y: 130 },
    { x: 560, y: 120 },
    { x: 60, y: 120 },
];

const CONNECTIONS: [number, number][] = [
    [9, 1],
    [1, 0],
    [1, 4],
    [1, 3],
    [4, 2],
    [4, 5],
    [3, 7],
    [7, 5],
    [7, 8],
    [5, 6],
    [2, 6],
    [0, 2],
];

// Heat rises. Re-order every pair so the lower node (bigger y) comes first,
// which makes the travelling dash always move upward on screen.
const RISING = CONNECTIONS.map(([a, b]) =>
    NODES[a].y >= NODES[b].y ? [a, b] : [b, a],
) as [number, number][];

const DASH = 4;
const GAP = 42;
const CYCLE = DASH + GAP;

// Cooler the higher it sits — same logic a real flame follows.
const heatColor = (y: number) =>
    y > 260 ? "#FFF7ED" : y > 180 ? "#FDBA74" : "#F97316";

const EMBERS = Array.from({ length: 12 }, (_, i) => ({
    x: 40 + ((i * 97) % 520),
    y: 380 - ((i * 53) % 90),
    rise: 150 + ((i * 37) % 150),
    sway: ((i % 3) - 1) * 20,
    size: 1 + (i % 3) * 0.7,
    duration: 2600 + ((i * 311) % 2200),
    delay: (i * 260) % 2800,
    color: i % 4 === 0 ? "#FFFBEB" : i % 3 === 0 ? "#FB923C" : "#FBBF24",
}));

// Irregular opacity steps. This is what separates flicker from breathing.
const flickerLoop = (value: Animated.Value) =>
    Animated.loop(
        Animated.sequence(
            Array.from({ length: 8 }, () =>
                Animated.timing(value, {
                    toValue: 0.3 + Math.random() * 0.7,
                    duration: 70 + Math.random() * 180,
                    useNativeDriver: false,
                }),
            ),
        ),
    );

export default function EmberNetwork() {
    const signalOffsets = useRef(
        RISING.map(() => new Animated.Value(0)),
    ).current;
    const signalFlicker = useRef(
        RISING.map(() => new Animated.Value(0.6)),
    ).current;
    const nodeFlicker = useRef(
        NODES.map(() => new Animated.Value(0.5)),
    ).current;
    const emberProgress = useRef(
        EMBERS.map(() => new Animated.Value(0)),
    ).current;

    useEffect(() => {
        const loops: Animated.CompositeAnimation[] = [];

        signalOffsets.forEach((offset, i) => {
            loops.push(
                Animated.loop(
                    Animated.timing(offset, {
                        toValue: -CYCLE,
                        duration: 700 + (i % 5) * 180,
                        useNativeDriver: false,
                    }),
                ),
            );
        });

        [...signalFlicker, ...nodeFlicker].forEach((v) =>
            loops.push(flickerLoop(v)),
        );

        emberProgress.forEach((p, i) => {
            loops.push(
                Animated.loop(
                    Animated.sequence([
                        Animated.delay(EMBERS[i].delay),
                        Animated.timing(p, {
                            toValue: 1,
                            duration: EMBERS[i].duration,
                            useNativeDriver: false,
                        }),
                        Animated.timing(p, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: false,
                        }),
                    ]),
                ),
            );
        });

        loops.forEach((l) => l.start());
        return () => loops.forEach((l) => l.stop());
    }, [signalOffsets, signalFlicker, nodeFlicker, emberProgress]);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg
                width="100%"
                height="100%"
                viewBox="0 0 600 420"
                preserveAspectRatio="xMidYMid slice"
            >
                <Defs>
                    {/* userSpaceOnUse so the gradient maps to screen height, not each line */}
                    <LinearGradient
                        id="wire"
                        x1="0"
                        y1="420"
                        x2="0"
                        y2="0"
                        gradientUnits="userSpaceOnUse"
                    >
                        <Stop
                            offset="0%"
                            stopColor="#FDBA74"
                            stopOpacity="0.35"
                        />
                        <Stop
                            offset="55%"
                            stopColor="#EA580C"
                            stopOpacity="0.18"
                        />
                        <Stop
                            offset="100%"
                            stopColor="#7C2D12"
                            stopOpacity="0.06"
                        />
                    </LinearGradient>

                    <RadialGradient id="heat" cx="50%" cy="100%" r="75%">
                        <Stop
                            offset="0%"
                            stopColor="#F97316"
                            stopOpacity="0.3"
                        />
                        <Stop
                            offset="60%"
                            stopColor="#B45309"
                            stopOpacity="0.1"
                        />
                        <Stop
                            offset="100%"
                            stopColor="#7C2D12"
                            stopOpacity="0"
                        />
                    </RadialGradient>

                    <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <Stop
                            offset="0%"
                            stopColor="#FBBF24"
                            stopOpacity="0.5"
                        />
                        <Stop
                            offset="100%"
                            stopColor="#FBBF24"
                            stopOpacity="0"
                        />
                    </RadialGradient>
                </Defs>

                {/* heat pooling at the base */}
                <Rect x="0" y="0" width="600" height="420" fill="url(#heat)" />

                {/* base wires */}
                {RISING.map(([a, b], i) => (
                    <Line
                        key={`base-${i}`}
                        x1={NODES[a].x}
                        y1={NODES[a].y}
                        x2={NODES[b].x}
                        y2={NODES[b].y}
                        stroke="url(#wire)"
                        strokeWidth={1}
                    />
                ))}

                {/* sparks climbing each wire */}
                {RISING.map(([a, b], i) => (
                    <AnimatedLine
                        key={`signal-${i}`}
                        x1={NODES[a].x}
                        y1={NODES[a].y}
                        x2={NODES[b].x}
                        y2={NODES[b].y}
                        stroke={heatColor((NODES[a].y + NODES[b].y) / 2)}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeDasharray={`${DASH} ${GAP}`}
                        strokeDashoffset={signalOffsets[i]}
                        opacity={signalFlicker[i]}
                    />
                ))}

                {/* node halos, then hot cores */}
                {NODES.map((n, i) => (
                    <AnimatedCircle
                        key={`halo-${i}`}
                        cx={n.x}
                        cy={n.y}
                        r={13}
                        fill="url(#glow)"
                        opacity={nodeFlicker[i]}
                    />
                ))}
                {NODES.map((n, i) => (
                    <AnimatedCircle
                        key={`node-${i}`}
                        cx={n.x}
                        cy={n.y}
                        r={3}
                        fill={heatColor(n.y)}
                        opacity={nodeFlicker[i]}
                    />
                ))}

                {/* free-floating embers drifting up and burning out */}
                {EMBERS.map((e, i) => (
                    <AnimatedCircle
                        key={`ember-${i}`}
                        r={e.size}
                        fill={e.color}
                        cx={emberProgress[i].interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [
                                e.x,
                                e.x + e.sway,
                                e.x - e.sway * 0.6,
                            ],
                        })}
                        cy={emberProgress[i].interpolate({
                            inputRange: [0, 1],
                            outputRange: [e.y, e.y - e.rise],
                        })}
                        opacity={emberProgress[i].interpolate({
                            inputRange: [0, 0.12, 0.6, 1],
                            outputRange: [0, 0.9, 0.45, 0],
                        })}
                    />
                ))}
            </Svg>
        </View>
    );
}
