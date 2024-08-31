import React, { useState, useRef, useCallback } from "react";
import { colleges, College } from "@/data";
import CollegeRow from "./college-row";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface SortIconsProps {
  sortField: string;
  sortOrder: "asc" | "desc";
  field: string;
}

const SortIcons: React.FC<SortIconsProps> = ({
  sortField,
  sortOrder,
  field,
}) => {
  const isActive = sortField === field;

  return (
    <div className="flex items-center">
      <FaArrowUp
        className={`transition-opacity ${
          isActive && sortOrder === "asc" ? "opacity-70" : "opacity-40"
        }`}
      />
      <FaArrowDown
        className={`transition-opacity ${
          isActive && sortOrder === "desc" ? "opacity-70" : "opacity-40"
        }`}
      />
    </div>
  );
};

const CollegeTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof College>("ranking");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [displayedColleges, setDisplayedColleges] = useState<College[]>(
    colleges.slice(0, 10)
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = () => {
    setDisplayedColleges((prev) => [
      ...prev,
      ...colleges.slice(prev.length, prev.length + 10),
    ]);
  };

  const lastRowRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSort = (field: keyof College) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const filteredAndSortedColleges = displayedColleges
    .filter((college) => college.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => {
      const compareValue =
        a[sortField] > b[sortField] ? 1 : a[sortField] < b[sortField] ? -1 : 0;
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by college name"
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-[#6BC1C4] text-white">
            <th
              className="border border-gray-200 p-2 text-left cursor-pointer"
              onClick={() => handleSort("ranking")}
            >
              <div className="flex justify-between">
                <span>CD Rank</span>
                <SortIcons
                  sortField={sortField as string}
                  sortOrder={sortOrder}
                  field="ranking"
                />
              </div>
            </th>
            <th className="border border-gray-200 p-2 text-left">Colleges</th>
            <th
              className="border border-gray-200 p-2 text-left cursor-pointer"
              onClick={() => handleSort("fees")}
            >
              <div className="flex justify-between">
                <span>Course Fees</span>
                <SortIcons
                  sortField={sortField as string}
                  sortOrder={sortOrder}
                  field="fees"
                />
              </div>
            </th>
            <th
              className="border border-gray-200 p-2 text-left cursor-pointer"
              onClick={() => handleSort("placement")}
            >
              <div className="flex justify-between">
                <span>Placement</span>
                <SortIcons
                  sortField={sortField as string}
                  sortOrder={sortOrder}
                  field="placement"
                />
              </div>
            </th>
            <th
              className="border border-gray-200 p-2 text-left cursor-pointer"
              onClick={() => handleSort("userRating")}
            >
              <div className="flex justify-between">
                <span>User Reviews</span>
                <SortIcons
                  sortField={sortField as string}
                  sortOrder={sortOrder}
                  field="userRating"
                />
              </div>
            </th>
            <th className="border border-gray-200 p-2 text-left">Ranking</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedColleges.map((college, index) => (
            <CollegeRow
              key={college.id}
              college={college}
              isLastRow={index === filteredAndSortedColleges.length - 1}
              observerRef={lastRowRef}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeTable;
