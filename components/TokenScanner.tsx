"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Search,
  Activity,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  ExternalLink,
  Clock,
  Wifi,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface TokenScannerProps {
  tokenMetadata: {
    name: string;
    symbol: string;
    address: string;
    totalSupply: number;
    liquidityPool?: string;
    topHolders: { address: string; balance: number; percent: number }[];
    risk: { centralization: string; liquidity: string; transfers: string };
  };
  holders: {
    address: string;
    balance: number;
    connections: string[];
  }[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  balance: number;
  connections: string[];
  radius: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: Node | string;
  target: Node | string;
}

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getRiskColor = (status: string) => {
  if (status === "low" || status === "locked")
    return "from-green-400 to-emerald-600";
  if (status === "medium" || status === "partial")
    return "from-yellow-400 to-orange-500";
  return "from-red-400 to-rose-600";
};

const getRiskBadge = (status: string) => {
  if (status === "low" || status === "locked")
    return "bg-green-500/20 text-green-400 border-green-500/50";
  if (status === "medium" || status === "partial")
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  return "bg-red-500/20 text-red-400 border-red-500/50";
};

export default function TokenScanner({
  tokenMetadata,
  holders,
}: TokenScannerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [timeframe, setTimeframe] = useState("24h");
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; delay: number }>
  >([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const particleArray = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.2,
    }));
    setParticles(particleArray);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.02);
      mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.02);
    }
  };

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;

    const maxBalance = Math.max(...holders.map((h) => h.balance));
    const minRadius = 10;
    const maxRadius = 45;

    const nodes: Node[] = holders.map((holder) => ({
      id: holder.address,
      balance: holder.balance,
      connections: holder.connections,
      radius:
        minRadius + (holder.balance / maxBalance) * (maxRadius - minRadius),
    }));

    const links: Link[] = [];
    holders.forEach((holder) => {
      holder.connections.forEach((conn) => {
        if (holders.find((h) => h.address === conn)) {
          links.push({
            source: holder.address,
            target: conn,
          });
        }
      });
    });

    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(links)
          .id((d) => d.id)
          .distance(150)
          .strength(0.3)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<Node>().radius((d) => d.radius + 10)
      )
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    const defs = svg.append("defs");

    const linkGradient = defs
      .append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    linkGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00ffff")
      .attr("stop-opacity", 0);

    linkGradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#00ffff")
      .attr("stop-opacity", 0.6);

    linkGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#9d4edd")
      .attr("stop-opacity", 0);

    const glowFilter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");

    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const linkGroup = g.append("g").attr("class", "links");

    const link = linkGroup
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("opacity", 0.4);

    nodes.forEach((node, i) => {
      const nodeGradient = defs
        .append("radialGradient")
        .attr("id", `node-gradient-${i}`);

      const colors = [
        { inner: "#00ffff", outer: "#0891b2" },
        { inner: "#ff00ff", outer: "#c026d3" },
        { inner: "#9d4edd", outer: "#6d28d9" },
        { inner: "#a3e635", outer: "#65a30d" },
      ];

      const colorSet = colors[i % colors.length];

      nodeGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorSet.inner)
        .attr("stop-opacity", 1);

      nodeGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorSet.outer)
        .attr("stop-opacity", 0.7);
    });

    const nodeGroup = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer");

    nodeGroup.each(function (d, i) {
      const group = d3.select(this);

      group
        .append("circle")
        .attr("class", "glow-ring")
        .attr("r", d.radius + 8)
        .attr("fill", "none")
        .attr("stroke", `url(#node-gradient-${i})`)
        .attr("stroke-width", 2)
        .attr("opacity", 0);

      group
        .append("circle")
        .attr("class", "main-node")
        .attr("r", d.radius)
        .attr("fill", `url(#node-gradient-${i})`)
        .attr("filter", "url(#glow)");

      group
        .append("circle")
        .attr("class", "core")
        .attr("r", d.radius * 0.5)
        .attr("fill", "white")
        .attr("opacity", 0.3);
    });

    nodeGroup
      .on("mouseenter", function (event, d) {
        setHoveredNode(d);

        const group = d3.select(this);

        group
          .select(".glow-ring")
          .transition()
          .duration(300)
          .attr("r", d.radius + 15)
          .attr("opacity", 0.8);

        group
          .select(".main-node")
          .transition()
          .duration(300)
          .attr("r", d.radius * 1.15);

        const connectedIds = new Set([d.id, ...d.connections]);

        nodeGroup
          .selectAll<SVGGElement, Node>("g")
          .transition()
          .duration(300)
          .attr("opacity", (node: Node) =>
            connectedIds.has(node.id) ? 1 : 0.3
          );

        link
          .transition()
          .duration(300)
          .attr("opacity", (l) => {
            const source =
              typeof l.source === "object" ? l.source.id : l.source;
            const target =
              typeof l.target === "object" ? l.target.id : l.target;
            return source === d.id || target === d.id ? 0.9 : 0.15;
          })
          .attr("stroke-width", (l) => {
            const source =
              typeof l.source === "object" ? l.source.id : l.source;
            const target =
              typeof l.target === "object" ? l.target.id : l.target;
            return source === d.id || target === d.id ? 3 : 2;
          });
      })
      .on("mouseleave", function (event, d) {
        if (!selectedNode || selectedNode.id !== d.id) {
          setHoveredNode(null);
        }

        const group = d3.select(this);

        group
          .select(".glow-ring")
          .transition()
          .duration(300)
          .attr("r", d.radius + 8)
          .attr("opacity", 0);

        group
          .select(".main-node")
          .transition()
          .duration(300)
          .attr("r", d.radius);

        if (!selectedNode) {
          nodeGroup
            .selectAll("g")
            .transition()
            .duration(300)
            .attr("opacity", 1);
          link
            .transition()
            .duration(300)
            .attr("opacity", 0.4)
            .attr("stroke-width", 2);
        }
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    svg.on("click", () => {
      setSelectedNode(null);
      setHoveredNode(null);
      nodeGroup.selectAll("g").transition().duration(300).attr("opacity", 1);
      link
        .transition()
        .duration(300)
        .attr("opacity", 0.4)
        .attr("stroke-width", 2);
    });

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const source = d.source as Node;
        const target = d.target as Node;
        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5;
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [holders, dimensions, selectedNode]);

  const displayNode = hoveredNode || selectedNode;

  return (
    <div
      className="w-full h-screen bg-black flex flex-col overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          x: springX,
          y: springY,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(0, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            filter: "blur(1px)",
          }}
        />
      </motion.div>

      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-black"
          initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
          animate={{
            x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x}%`],
            y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + particle.delay,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="flex-1 flex relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div ref={containerRef} className="w-full h-full relative">
            <svg ref={svgRef} className="w-full h-full" />
          </div>

          <AnimatePresence>
            {displayNode && !selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-[#0a192f]/95 backdrop-blur-xl border border-cyan-500/50 rounded-xl p-4 shadow-2xl min-w-[280px]"
                style={{ boxShadow: "0 0 40px rgba(0, 255, 255, 0.3)" }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cyan-400/70 uppercase tracking-wider">
                      Wallet
                    </span>
                    <ExternalLink className="w-3 h-3 text-cyan-400/50" />
                  </div>
                  <div className="text-sm font-mono text-cyan-300">
                    {shortenAddress(displayNode.id)}
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-400">Holdings</div>
                      <div className="text-lg font-bold text-white">
                        {(displayNode.balance / 1000000).toFixed(2)}M
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Supply %</div>
                      <div className="text-lg font-bold text-violet-400">
                        {(
                          (displayNode.balance / tokenMetadata.totalSupply) *
                          100
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-300">
                      {displayNode.connections.length} connections
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-[420px] bg-black backdrop-blur-xl border-none"
        >
          <div className="p-6 space-y-6 overflow-y-auto max-h-screen scrollbar-hide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute -top-2 -left-2 w-full h-full bg-black rounded-xl blur-xl" />
              <Card className="relative bg-black border-gray-500 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {tokenMetadata.symbol.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {tokenMetadata.name}
                    </h2>
                    <p className="text-sm text-cyan-400 font-mono">
                      ${tokenMetadata.symbol}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-2">
                      {shortenAddress(tokenMetadata.address)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Total Supply</span>
                    <span className="text-sm font-bold text-white">
                      {(tokenMetadata.totalSupply / 1000000).toFixed(0)}M
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Risk Signals
                </h3>
              </div>

              <Card className="bg-black border-gray-500 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Centralization
                    </span>
                    <Badge
                      className={`${getRiskBadge(
                        tokenMetadata.risk.centralization
                      )} uppercase text-xs`}
                    >
                      {tokenMetadata.risk.centralization}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Liquidity Lock
                    </span>
                    <Badge
                      className={`${getRiskBadge(
                        tokenMetadata.risk.liquidity
                      )} uppercase text-xs`}
                    >
                      {tokenMetadata.risk.liquidity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">
                      Transfer Spikes
                    </span>
                    <Badge
                      className={`${getRiskBadge(
                        tokenMetadata.risk.transfers
                      )} uppercase text-xs`}
                    >
                      {tokenMetadata.risk.transfers}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                  Top Holders
                </h3>
              </div>

              <div className="space-y-2">
                {tokenMetadata.topHolders.slice(0, 5).map((holder, idx) => (
                  <motion.div
                    key={holder.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                  >
                    <Card className="bg-black border-gray-500 p-3 hover:border-gray-400 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-gray-400">
                          {shortenAddress(holder.address)}
                        </span>
                        <span className="text-xs font-bold text-cyan-400">
                          {holder.percent}%
                        </span>
                      </div>

                      <div className="relative h-2 bg-[#020617] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${holder.percent}%` }}
                          transition={{ duration: 1, delay: 1 + idx * 0.1 }}
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getRiskColor(
                            "low"
                          )} rounded-full`}
                          style={{
                            boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                          }}
                        />
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        {(holder.balance / 1000000).toFixed(2)}M tokens
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {selectedNode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                      Active Scan
                    </h3>
                  </div>

                  <Card className="bg-gradient-to-br from-yellow-900/20 to-violet-900/20 border-yellow-500/50 p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-yellow-400/70 mb-1">
                          Selected Wallet
                        </div>
                        <div className="text-sm font-mono text-yellow-300 break-all">
                          {selectedNode.id}
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">
                            Balance
                          </div>
                          <div className="text-lg font-bold text-white">
                            {(selectedNode.balance / 1000000).toFixed(2)}M
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">
                            Network
                          </div>
                          <div className="text-lg font-bold text-violet-400">
                            {selectedNode.connections.length}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button className="w-full py-2 px-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm font-medium transition-all flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View on Explorer
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}