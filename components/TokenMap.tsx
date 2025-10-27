"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";

export interface TokenMapProps {
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

const getRiskIcon = (status: string) => {
  if (status === "low" || status === "locked")
    return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (status === "medium" || status === "partial")
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  return <AlertCircle className="w-4 h-4 text-red-400" />;
};

export default function TokenMap({ tokenMetadata, holders }: TokenMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { address } = useParams();

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
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;

    const maxBalance = Math.max(...holders.map((h) => h.balance));
    const minRadius = 8;
    const maxRadius = 60;

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
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<Node>().radius((d) => d.radius + 5)
      );

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.3);

    const dragBehavior = d3
      .drag<SVGGElement, Node>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeGroup = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(dragBehavior as any);

    const gradients = svg.append("defs");

    nodes.forEach((node, i) => {
      const gradient = gradients
        .append("radialGradient")
        .attr("id", `gradient-${i}`);

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr(
          "stop-color",
          i % 3 === 0 ? "#38bdf8" : i % 3 === 1 ? "#818cf8" : "#22d3ee"
        )
        .attr("stop-opacity", 0.9);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr(
          "stop-color",
          i % 3 === 0 ? "#0284c7" : i % 3 === 1 ? "#6366f1" : "#0891b2"
        )
        .attr("stop-opacity", 0.6);
    });

    nodeGroup
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (_, i) => `url(#gradient-${i})`)
      .attr("stroke", "#38bdf8")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))")
      .on("mouseenter", function (event, d) {
        setHoveredNode(d);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.radius * 1.1)
          .style("filter", "drop-shadow(0 0 20px rgba(56, 189, 248, 0.8))");

        const connectedIds = new Set([d.id, ...d.connections]);

        nodeGroup
          .selectAll<SVGCircleElement, Node>("circle")
          .transition()
          .duration(200)
          .attr("opacity", (node: Node) =>
            connectedIds.has(node.id) ? 1 : 0.4
          );

        link
          .transition()
          .duration(200)
          .attr("stroke-opacity", (l) => {
            const source =
              typeof l.source === "object" ? l.source.id : l.source;
            const target =
              typeof l.target === "object" ? l.target.id : l.target;
            return source === d.id || target === d.id ? 0.8 : 0.1;
          })
          .attr("stroke", (l) => {
            const source =
              typeof l.source === "object" ? l.source.id : l.source;
            const target =
              typeof l.target === "object" ? l.target.id : l.target;
            return source === d.id || target === d.id ? "#38bdf8" : "#1e293b";
          })
          .attr("stroke-width", (l) => {
            const source =
              typeof l.source === "object" ? l.source.id : l.source;
            const target =
              typeof l.target === "object" ? l.target.id : l.target;
            return source === d.id || target === d.id ? 2.5 : 1.5;
          });
      })
      .on("mouseleave", function (event, d) {
        if (!selectedNode || selectedNode.id !== d.id) {
          setHoveredNode(null);
        }
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.radius)
          .style("filter", "drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))");

        if (!selectedNode) {
          nodeGroup
            .selectAll("circle")
            .transition()
            .duration(200)
            .attr("opacity", 1);
          link
            .transition()
            .duration(200)
            .attr("stroke-opacity", 0.3)
            .attr("stroke", "#1e293b")
            .attr("stroke-width", 1.5);
        }
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    svg.on("click", () => {
      setSelectedNode(null);
      setHoveredNode(null);
      nodeGroup
        .selectAll("circle")
        .transition()
        .duration(200)
        .attr("opacity", 1);
      link
        .transition()
        .duration(200)
        .attr("stroke-opacity", 0.3)
        .attr("stroke", "#1e293b")
        .attr("stroke-width", 1.5);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [holders, dimensions, selectedNode]);

  const displayNode = hoveredNode || selectedNode;

  return (
    <div className="w-full h-screen bg-black flex overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 relative"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.1) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            className="absolute rounded-full border-2 border-cyan-500/20"
            initial={{ width: 100, height: 100, opacity: 0.8 }}
            animate={{
              width: [100, 1400, 100],
              height: [100, 1400, 100],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-blue-500/20"
            initial={{ width: 100, height: 100, opacity: 0.8 }}
            animate={{
              width: [100, 1400, 100],
              height: [100, 1400, 100],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-violet-500/20"
            initial={{ width: 100, height: 100, opacity: 0.8 }}
            animate={{
              width: [100, 1400, 100],
              height: [100, 1400, 100],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="absolute top-6 left-6 z-10 w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/80 border-slate-700 text-gray-200 placeholder:text-gray-500 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-slate-700">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-gray-300">Snapshot: 5 mins ago</span>
        </div>

        <div ref={containerRef} className="w-full h-full relative">
          <svg ref={svgRef} className="w-full h-full" />
        </div>

        <AnimatePresence>
          {displayNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-24 left-6 z-20 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4 shadow-xl"
              style={{ boxShadow: "0 0 30px rgba(56, 189, 248, 0.3)" }}
            >
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Wallet Address</div>
                <div className="text-sm font-mono text-cyan-400">
                  {shortenAddress(displayNode.id)}
                </div>
                <div className="text-xs text-gray-400 mt-3">Token Balance</div>
                <div className="text-lg font-bold text-white">
                  {displayNode.balance.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  % of Total Supply
                </div>
                <div className="text-sm text-gray-200">
                  {(
                    (displayNode.balance / tokenMetadata.totalSupply) *
                    100
                  ).toFixed(4)}
                  %
                </div>
                <div className="text-xs text-gray-400 mt-2">Connections</div>
                <div className="text-sm text-gray-200">
                  {displayNode.connections.length} wallets
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-[30%] min-w-[400px] bg-slate-900/50 backdrop-blur-xl border-l border-slate-800 p-6 overflow-y-auto"
      >
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {tokenMetadata.symbol.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {tokenMetadata.name}
                </h2>
                <p className="text-sm text-gray-400">${tokenMetadata.symbol}</p>
              </div>
            </div>
            <div className="text-xs font-mono text-gray-500 break-all">
              {shortenAddress(tokenMetadata.address)}
            </div>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Supply</span>
                <span className="text-sm font-bold text-white">
                  {tokenMetadata.totalSupply}
                </span>
              </div>
              {tokenMetadata.liquidityPool && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Liquidity Pool</span>
                  <span className="text-xs font-mono text-cyan-400">
                    {shortenAddress(tokenMetadata.liquidityPool)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Top 5 Holders
            </h3>
            <div className="space-y-2">
              {tokenMetadata.topHolders.map((holder, idx) => (
                <motion.div
                  key={holder.address}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono text-gray-400">
                      {shortenAddress(holder.address)}
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {holder.percent}%
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {holder.balance.toLocaleString()}
                  </div>
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${holder.percent}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Risk Snapshot
            </h3>
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(tokenMetadata.risk.centralization)}
                    <span className="text-sm text-gray-300">
                      Centralization Risk
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    {tokenMetadata.risk.centralization}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(tokenMetadata.risk.liquidity)}
                    <span className="text-sm text-gray-300">
                      Liquidity Lock
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    {tokenMetadata.risk.liquidity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(tokenMetadata.risk.transfers)}
                    <span className="text-sm text-gray-300">
                      Transfer Spikes
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    {tokenMetadata.risk.transfers}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                Selected Wallet
              </h3>
              <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/50 p-4">
                <div className="space-y-3">
                  <div className="text-xs text-gray-400">Address</div>
                  <div className="text-sm font-mono text-cyan-300 break-all">
                    {selectedNode.id}
                  </div>
                  <div className="text-xs text-gray-400 mt-3">Holdings</div>
                  <div className="text-xl font-bold text-white">
                    {selectedNode.balance.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Connected Wallets
                  </div>
                  <div className="text-sm text-gray-300">
                    {selectedNode.connections.length} connections
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
