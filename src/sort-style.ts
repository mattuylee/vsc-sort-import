import {
  IComparatorFunction,
  ISorterFunction,
  IStyleAPI,
  IStyleItem,
} from "import-sort-style";
import { IImport } from "import-sort-parser";

export default function (styleApi: IStyleAPI): IStyleItem[] {
  const {
    and,
    always,
    dotSegmentCount,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    name,
    startsWithAlphanumeric,
    unicode,
  } = styleApi;

  // comparator function which place non-alphanumeric first
  const natural: IComparatorFunction = (a: string, b: string) => {
    if (a === b) {
      return 0;
    }
    const sa = startsWithAlphanumeric(a),
      sb = startsWithAlphanumeric(b);
    if (sa === sb) {
      return unicode(a, b);
    } else {
      return sa ? 1 : -1;
    }
  };
  // sort: use member primarily, if member is not avaliable, use module name
  const memberOrModule: (c: IComparatorFunction) => ISorterFunction = (
    comparator: IComparatorFunction
  ) => {
    return (a: IImport, b: IImport): number => {
      const aHasDefaultMember = Boolean(a.defaultMember),
        aHasNamespaceMember = Boolean(a.namespaceMember),
        aHasNamedMember = Boolean(a.namedMembers[0]?.name),
        aHasOnlyDefaultMember =
          aHasDefaultMember && !aHasNamespaceMember && !aHasNamedMember,
        aHasOnlyNamespaceMember =
          aHasNamespaceMember && !aHasDefaultMember && !aHasNamedMember;
      const bHasDefaultMember = Boolean(b.defaultMember),
        bHasNamespaceMember = Boolean(b.namespaceMember),
        bHasNamedMember = Boolean(b.namedMembers[0]?.name),
        bHasOnlyDefaultMember =
          bHasDefaultMember && !bHasNamespaceMember && !bHasNamedMember,
        bHasOnlyNamespaceMember =
          bHasNamespaceMember && !bHasDefaultMember && !bHasNamedMember;
      if (aHasOnlyNamespaceMember !== bHasOnlyNamespaceMember) {
        return aHasOnlyNamespaceMember ? -1 : 1;
      } else if (aHasOnlyDefaultMember !== bHasOnlyDefaultMember) {
        return aHasOnlyDefaultMember ? -1 : 1;
      } else if (aHasNamespaceMember !== bHasNamespaceMember) {
        return aHasNamespaceMember ? -1 : 1;
      } else if (aHasDefaultMember !== bHasDefaultMember) {
        return aHasDefaultMember ? -1 : 1;
      } else if (aHasNamedMember !== bHasNamedMember) {
        return aHasNamedMember ? -1 : 1;
      }
      const first =
        a.defaultMember ||
        a.namespaceMember ||
        a.namedMembers[0]?.name ||
        a.moduleName;
      const second =
        b.defaultMember ||
        b.namespaceMember ||
        b.namedMembers[0]?.name ||
        b.moduleName;
      return comparator(first, second);
    };
  };

  return [
    // built-in module, has member
    {
      match: isNodeModule,
      sort: memberOrModule(natural),
      sortNamedMembers: name(natural),
    },
    // absolute
    {
      match: isAbsoluteModule,
      sort: memberOrModule(natural),
      sortNamedMembers: name(natural),
    },
    // relative
    {
      match: isRelativeModule,
      sort: [dotSegmentCount, memberOrModule(natural)],
      sortNamedMembers: name(natural),
    },
    // fallback
    {
      match: always,
      sort: [dotSegmentCount, memberOrModule(natural)],
      sortNamedMembers: name(natural),
    },
  ];
}
