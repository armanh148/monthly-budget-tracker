import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from './Icon';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-US')}`;
};

export default function SummaryCards({
  onOpenSetIncome,
  onOpenAddExpense,
  onToggleCategoryBreakdown,
  onOpenExport
}) {
  const { summary } = useBudget();
  const { user, themeMode } = useAuth();
  const colors = palette[themeMode] || palette.light;
  const isDark = themeMode === 'dark';

  const totalIncome = summary.total_income || 0;
  const totalExpense = summary.total_expense || 0;
  const remainingBalance =
    summary.remaining_balance !== undefined
      ? summary.remaining_balance
      : totalIncome - totalExpense;
  const burnRate = summary.burn_rate_percent || 0;
  const isOverBudget = remainingBalance < 0;
  const isBudgetAlert = summary.is_budget_alert || burnRate >= 80;

  // Puffy 3D Clay Card palette (Cyber Lime Hero Card)
  let cardBg = colors.brandCard;
  let cardShadow = isDark ? '#000000' : colors.cardShadow || '#A2D31E';

  if (isOverBudget) {
    cardBg = '#D9435E';
    cardShadow = '#B82C45';
  } else if (isBudgetAlert) {
    cardBg = '#D9822B';
    cardShadow = '#B5661A';
  }

  const isCustomAlert = isOverBudget || isBudgetAlert;
  const cardTextColor = isCustomAlert ? '#FFFFFF' : colors.brandCardText || '#FFFFFF';
  const cardMutedColor = isCustomAlert ? 'rgba(255, 255, 255, 0.82)' : 'rgba(255, 255, 255, 0.85)';
  const cardStripBg = 'rgba(0, 0, 0, 0.22)';

  return (
    <View style={styles.wrapper}>
      {/* Curved Violet Clay Backdrop Behind Top Half of Floating Card */}
      <View style={[styles.curvedBackdrop, { backgroundColor: colors.topBackdrop }]} />

      <View style={styles.container}>
        {/* 1. Hyper-Realistic Physical Metal Executive Card */}
        <View
          style={[
            styles.physicalCard,
            {
              backgroundColor: cardBg,
              shadowColor: cardShadow
            }
          ]}
        >
          {/* Real Metallic Chamfered Edges (Top & Left Specular Reflection, Bottom & Right Bevel) */}
          <View style={styles.cardEdgeHighlightTop} />
          <View style={styles.cardEdgeHighlightLeft} />
          <View style={styles.cardEdgeBevelBottom} />

          {/* Diagonal Brushed Metallic Light Sheen Beam */}
          <View style={styles.specularLightBeam} />
          <View style={styles.specularSecondarySheen} />

          {/* Warm Ambient Corner Glow */}
          <View style={styles.cardAmbientGlow} />

          {/* Row 1: Issuer Brand Crest & Luxury Badges */}
          <View style={styles.cardTopRow}>
            <View style={styles.issuerBadgeWrap}>
              <View style={styles.issuerIconPill}>
                <Ionicons name="diamond" size={13} color="#93C5FD" />
              </View>
              <Text style={styles.issuerTitle}>NAVY VAULT</Text>
            </View>

            <View style={styles.topRightBadges}>
              <View style={styles.nfcWaveBadge}>
                <Ionicons
                  name="wifi"
                  size={15}
                  color="#FFFFFF"
                  style={{ transform: [{ rotate: '90deg' }] }}
                />
              </View>
              <View style={styles.platinumMetalPill}>
                <Text style={styles.platinumMetalText}>METAL</Text>
              </View>
            </View>
          </View>

          {/* Row 2: Hyper-Realistic ISO EMV Smart Chip & Contactless */}
          <View style={styles.chipAndBalanceRow}>
            {/* The Realistic Metallic EMV Chip */}
            <View style={styles.realisticEmvChip}>
              {/* Chip Metallic Highlight Glare */}
              <View style={styles.chipGlareDot} />

              {/* Top Contact Pads */}
              <View style={styles.chipPadRow}>
                <View style={[styles.chipPad, styles.chipPadTopLeft]} />
                <View style={[styles.chipPad, styles.chipPadTopCenter]} />
                <View style={[styles.chipPad, styles.chipPadTopRight]} />
              </View>

              {/* Middle Core Contact Pad */}
              <View style={styles.chipPadRow}>
                <View style={[styles.chipPad, styles.chipPadMidLeft]} />
                <View style={styles.chipCenterCore}>
                  <View style={styles.chipCoreInnerDot} />
                </View>
                <View style={[styles.chipPad, styles.chipPadMidRight]} />
              </View>

              {/* Bottom Contact Pads */}
              <View style={styles.chipPadRow}>
                <View style={[styles.chipPad, styles.chipPadBottomLeft]} />
                <View style={[styles.chipPad, styles.chipPadBottomCenter]} />
                <View style={[styles.chipPad, styles.chipPadBottomRight]} />
              </View>

              {/* Laser-Etched Hairline Isolation Grooves */}
              <View style={styles.chipHorizontalGroove} />
              <View style={styles.chipVerticalGrooveLeft} />
              <View style={styles.chipVerticalGrooveRight} />
            </View>

            {/* Prominent Balance Display */}
            <View style={styles.balanceContainer}>
              <Text style={[styles.balanceOverline, { color: cardMutedColor }]}>TOTAL BALANCE</Text>
              <Text
                style={[styles.balanceFigure, { color: cardTextColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatCurrency(remainingBalance)}
              </Text>
            </View>
          </View>

          {/* Row 3: Laser-Etched Stamped Card Digits */}
          <View style={styles.embossedDigitsRow}>
            <Text style={styles.embossedDigits}>
              •••• •••• •••• <Text style={styles.digitsHighlight}>3432</Text>
            </Text>
          </View>

          {/* Row 4: Cardholder Name, Expiry, and Authentic Mastercard Hologram */}
          <View style={styles.cardFooterDetails}>
            <View style={styles.cardholderBlock}>
              <Text style={[styles.cardMetaLabel, { color: cardMutedColor }]}>CARDHOLDER</Text>
              <Text style={[styles.cardMetaValue, { color: cardTextColor }]} numberOfLines={1}>
                {(user?.name || 'DEMO USER').toUpperCase()}
              </Text>
            </View>

            <View style={styles.expiryBlock}>
              <Text style={[styles.cardMetaLabel, { color: cardMutedColor }]}>VALID THRU</Text>
              <Text style={[styles.cardMetaValue, { color: cardTextColor }]}>12/28</Text>
            </View>

            {/* Authentic Interlocking Mastercard Brand Mark */}
            <View style={styles.mastercardBrandWrap}>
              <View style={styles.mastercardCircles}>
                <View style={[styles.mcCircleReal, styles.mcRed]} />
                <View style={[styles.mcCircleReal, styles.mcYellow]} />
                {/* Overlapping Amber Lens */}
                <View style={styles.mcIntersectionLens} />
              </View>
              <Text style={styles.mcWordmark}>mastercard</Text>
            </View>
          </View>

          {/* Row 5: Precision Smoked Glass Metrics Strip */}
          <View
            style={[
              styles.metricsStrip,
              {
                backgroundColor: cardStripBg,
                borderColor: 'rgba(255, 255, 255, 0.22)'
              }
            ]}
          >
            <TouchableOpacity
              style={styles.metricHalf}
              onPress={onOpenSetIncome}
              activeOpacity={0.8}
            >
              <View style={styles.metricTitleRow}>
                <View style={[styles.metricDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={[styles.metricOverline, { color: cardMutedColor }]}>INCOME</Text>
              </View>
              <Text style={[styles.metricVal, { color: cardTextColor }]}>
                {formatCurrency(totalIncome)}
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.metricDivider,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              ]}
            />

            <TouchableOpacity
              style={styles.metricHalf}
              onPress={onOpenAddExpense}
              activeOpacity={0.8}
            >
              <View style={styles.metricTitleRow}>
                <View style={[styles.metricDot, { backgroundColor: '#EF4444' }]} />
                <Text style={[styles.metricOverline, { color: cardMutedColor }]}>EXPENSES</Text>
              </View>
              <Text style={[styles.metricVal, { color: cardTextColor }]}>
                {formatCurrency(totalExpense)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Four Executive Sunset Action Tiles */}
        <View style={styles.tilesGrid}>
          {/* Tile 1: Sunset Gold (Income) */}
          <TouchableOpacity
            style={styles.tileCol}
            onPress={onOpenSetIncome}
            activeOpacity={0.7}
            accessibilityLabel="Set Monthly Income"
          >
            <View
              style={[
                styles.clayTile,
                {
                  backgroundColor: colors.tileMint,
                  shadowColor: colors.tileMint
                }
              ]}
            >
              <View style={styles.tileSheen} />
              <Ionicons name="wallet" size={26} color={colors.tileMintText || '#FFFFFF'} />
            </View>
            <Text style={[styles.tileLabel, { color: colors.text }]}>Income</Text>
          </TouchableOpacity>

          {/* Tile 2: Sunset Tangerine (Expense) */}
          <TouchableOpacity
            style={styles.tileCol}
            onPress={onOpenAddExpense}
            activeOpacity={0.7}
            accessibilityLabel="Add Expense"
          >
            <View
              style={[
                styles.clayTile,
                {
                  backgroundColor: colors.tileCoral,
                  shadowColor: colors.tileCoral
                }
              ]}
            >
              <View style={styles.tileSheen} />
              <Ionicons name="receipt" size={26} color={colors.tileCoralText || '#FFFFFF'} />
            </View>
            <Text style={[styles.tileLabel, { color: colors.text }]}>Expense</Text>
          </TouchableOpacity>

          {/* Tile 3: Amber Mandarin (Analytics) */}
          <TouchableOpacity
            style={styles.tileCol}
            onPress={onToggleCategoryBreakdown}
            activeOpacity={0.7}
            accessibilityLabel="View Analytics"
          >
            <View
              style={[
                styles.clayTile,
                {
                  backgroundColor: colors.tileViolet,
                  shadowColor: colors.tileViolet
                }
              ]}
            >
              <View style={styles.tileSheen} />
              <Ionicons name="bar-chart" size={26} color={colors.tileVioletText || '#FFFFFF'} />
            </View>
            <Text style={[styles.tileLabel, { color: colors.text }]}>Analytics</Text>
          </TouchableOpacity>

          {/* Tile 4: Espresso Slate (Statement) */}
          <TouchableOpacity
            style={styles.tileCol}
            onPress={onOpenExport}
            activeOpacity={0.7}
            accessibilityLabel="Export Statement"
          >
            <View
              style={[
                styles.clayTile,
                {
                  backgroundColor: colors.tileCyan,
                  shadowColor: colors.tileCyan
                }
              ]}
            >
              <View style={styles.tileSheen} />
              <Ionicons name="document-text" size={26} color={colors.tileCyanText || '#FEFFFE'} />
            </View>
            <Text style={[styles.tileLabel, { color: colors.text }]}>Statement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    paddingBottom: 6
  },
  curvedBackdrop: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 126,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 6
  },

  // 1. Hyper-Realistic Physical Metal Card
  physicalCard: {
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.65)',
    borderLeftColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(0, 0, 0, 0.35)',
    borderBottomColor: 'rgba(0, 0, 0, 0.45)',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.38,
    shadowRadius: 22,
    elevation: 10,
    position: 'relative',
    overflow: 'hidden'
  },
  cardEdgeHighlightTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.55)'
  },
  cardEdgeHighlightLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  cardEdgeBevelBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  specularLightBeam: {
    position: 'absolute',
    top: -60,
    left: -30,
    width: 220,
    height: 420,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    transform: [{ rotate: '-32deg' }]
  },
  specularSecondarySheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  cardAmbientGlow: {
    position: 'absolute',
    bottom: -50,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(37, 99, 235, 0.22)'
  },

  // Row 1: Top Issuer Row
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  issuerBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  issuerIconPill: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  issuerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2
  },
  topRightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  nfcWaveBadge: {
    opacity: 0.9
  },
  platinumMetalPill: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)'
  },
  platinumMetalText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5
  },

  // Row 2: Hyper-Realistic EMV Chip & Balance
  chipAndBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  realisticEmvChip: {
    width: 46,
    height: 35,
    borderRadius: 7,
    backgroundColor: '#D4A017',
    borderWidth: 1.2,
    borderColor: '#FFEAA7',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3
  },
  chipGlareDot: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  chipPadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 9.5
  },
  chipPad: {
    backgroundColor: '#E5A93C',
    flex: 1,
    marginHorizontal: 1,
    height: '100%'
  },
  chipPadTopLeft: {
    borderTopLeftRadius: 4
  },
  chipPadTopCenter: {
    flex: 1.2
  },
  chipPadTopRight: {
    borderTopRightRadius: 4
  },
  chipPadMidLeft: {
    flex: 1
  },
  chipCenterCore: {
    flex: 1.4,
    height: 9.5,
    borderRadius: 3,
    borderWidth: 0.8,
    borderColor: '#8C590A',
    backgroundColor: '#D69520',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chipCoreInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 234, 167, 0.6)'
  },
  chipPadMidRight: {
    flex: 1
  },
  chipPadBottomLeft: {
    borderBottomLeftRadius: 4
  },
  chipPadBottomCenter: {
    flex: 1.2
  },
  chipPadBottomRight: {
    borderBottomRightRadius: 4
  },
  chipHorizontalGroove: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0.8,
    backgroundColor: '#784B05'
  },
  chipVerticalGrooveLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 14,
    width: 0.8,
    backgroundColor: '#784B05'
  },
  chipVerticalGrooveRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 14,
    width: 0.8,
    backgroundColor: '#784B05'
  },

  balanceContainer: {
    alignItems: 'flex-end'
  },
  balanceOverline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2
  },
  balanceFigure: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.5
  },

  // Row 3: Embossed Digits
  embossedDigitsRow: {
    marginBottom: 16
  },
  embossedDigits: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3.5,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 1
  },
  digitsHighlight: {
    color: '#93C5FD'
  },

  // Row 4: Footer Meta & Mastercard
  cardFooterDetails: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  cardholderBlock: {
    flex: 1.4
  },
  expiryBlock: {
    flex: 0.9
  },
  cardMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 3
  },
  cardMetaValue: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  mastercardBrandWrap: {
    alignItems: 'center',
    paddingTop: 2
  },
  mastercardCircles: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: 38,
    height: 24
  },
  mcCircleReal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute'
  },
  mcRed: {
    left: 0,
    backgroundColor: '#EB001B'
  },
  mcYellow: {
    right: 0,
    backgroundColor: '#F79E1B'
  },
  mcIntersectionLens: {
    position: 'absolute',
    left: 11,
    width: 16,
    height: 24,
    backgroundColor: 'rgba(255, 95, 0, 0.85)',
    borderRadius: 8
  },
  mcWordmark: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 2
  },

  // Row 5: Precision Smoked Glass Metrics Strip
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.28)'
  },
  metricHalf: {
    flex: 1
  },
  metricTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  metricOverline: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  metricVal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  metricDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    marginHorizontal: 12
  },

  // 4 Action Tiles
  tilesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 6
  },
  tileCol: {
    alignItems: 'center',
    flex: 1
  },
  clayTile: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 227, 179, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden'
  },
  tileSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.1
  }
});
